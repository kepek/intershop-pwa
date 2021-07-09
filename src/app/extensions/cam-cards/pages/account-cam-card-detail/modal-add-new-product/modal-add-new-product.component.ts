import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { AddressHelper } from 'ish-core/models/address/address.helper';
import { Address } from 'ish-core/models/address/address.model';
import { AttributeHelper } from 'ish-core/models/attribute/attribute.helper';
import { Bucket } from 'ish-core/models/basket/bucket.model';
import { ProductView } from 'ish-core/models/product-view/product-view.model';
import { Product, ProductCompletenessLevel, ProductHelper } from 'ish-core/models/product/product.model';
import { whenTruthy } from 'ish-core/utils/operators';
import { markAsDirtyRecursive } from 'ish-shared/forms/utils/form-utils';

import { CamCardsFacade } from '../../../facades/cam-cards.facade';
import { CamCard, CamCardItemComment } from '../../../models/cam-card/cam-card.model';

import { ADD_NEW_PRODUCT_VALIDATORS } from './validators';

@Component({
  selector: 'camfil-modal-add-new-product',
  templateUrl: './modal-add-new-product.component.html',
  styleUrls: ['./modal-add-new-product.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalAddNewProductComponent implements OnInit, OnDestroy {
  constructor(
    private productFacade: ShoppingFacade,
    private camCardsFacade: CamCardsFacade,
    public dialog: MatDialog
  ) {}

  /**
   * Callback function to hide modal dialog (used with ishServerHtml). - is needed for closing the dialog after the user clicks a message link
   */
  get callbackHideDialogModal() {
    return () => {
      this.hide();
    };
  }

  private static REQUIRED_COMPLETENESS_LEVEL = ProductCompletenessLevel.List;
  modal: NgbModalRef;
  productForm: FormGroup;

  dummyProduct = { sku: 'dummy', inStock: true, availability: true };
  product$: Observable<ProductView>;
  product: Product;

  currentCamCard$: Observable<CamCard>;
  rootCamCardId: string;

  @Input() addToOrder = false;
  @Input() order?: Bucket;
  @Input() shippingMethodId?: string;

  showSkuError = false;
  loading = false;
  isSubmitted = false;
  requiresMeasurement: boolean;
  private destroy$ = new Subject();
  basketAddresses: Address[];

  validators = ADD_NEW_PRODUCT_VALIDATORS;

  @ViewChild('modal', { static: false }) modalTemplate: TemplateRef<unknown>;

  ngOnInit() {
    this.currentCamCard$ = this.camCardsFacade.currentCamCard$;

    this.productForm = new FormGroup({
      quantity: new FormControl(1),
      sku: new FormControl('', [Validators.required]),
      boxLabel: new FormControl('', [Validators.maxLength(60)]),
      measurementWidth: new FormControl(),
      measurementHeight: new FormControl(),
      measurementDiameter: new FormControl(),
      measurementErrorInfo: new FormControl(),
    });

    if (this.addToOrder) {
      this.productFacade.basketAddresses$.pipe(takeUntil(this.destroy$)).subscribe((basketAddresses: Address[]) => {
        this.basketAddresses = basketAddresses;
      });

      this.productFacade.productUpdated$.pipe(whenTruthy(), takeUntil(this.destroy$)).subscribe(() => {
        this.loading = false;
        this.hide();
      });

      this.productFacade.productAdded$.pipe(whenTruthy(), take(1)).subscribe(() => {
        this.loading = false;
        this.hide();
      });
    } else {
      this.currentCamCard$?.pipe(takeUntil(this.destroy$)).subscribe(camCard => {
        this.rootCamCardId = camCard?.id || undefined;
      });
    }
  }

  isSkuValid = () => this.isSubmitted || (!this.product?.failed && this.product?.availability);

  validateSku() {
    const sku = this.productForm.get('sku').value;

    if (sku) {
      this.requiresMeasurement = false;
      this.loading = true;
      this.product$ = this.productFacade.product$(sku, ModalAddNewProductComponent.REQUIRED_COMPLETENESS_LEVEL);

      this.product$.pipe(take(1)).subscribe(product => {
        this.product = product;
        this.showSkuError = !this.isSkuValid();

        if (!this.isSubmitted) {
          this.loading = false;
        }

        if (this.isSkuValid()) {
          this.requiresMeasurement = ProductHelper.getRequiresMeasurement(this.product);
          this.setQuantityValidation(this.product.minOrderQuantity, this.product.maxOrderQuantity);
        }
      });
    }
  }

  setQuantityValidation(min: number, max: number) {
    this.productForm.controls.quantity.setValidators([Validators.min(min), Validators.max(max)]);
    this.productForm.controls.quantity.updateValueAndValidity();
  }

  submitForm() {
    if (this.productForm.valid && !this.showSkuError) {
      const sku = this.getField('sku')?.value ? String(this.getField('sku').value) : undefined;
      const quantity = this.getField('quantity')?.value ? Number(this.getField('quantity')?.value) : 1;
      const label = this.getField('boxLabel')?.value ? String(this.getField('boxLabel').value) : undefined;
      const comment: CamCardItemComment = label ? { label } : undefined;
      const lineItemAttributes = AttributeHelper.calculateAttrsToAddFromForm(this.productForm);

      this.isSubmitted = true;

      if (this.addToOrder) {
        const type = this.order.id.split('_')[0];
        this.loading = true;

        if (this.order.id && type !== 'emptyBucket' && this.order.shipToAddress) {
          this.addToExistingOrder(sku, quantity, this.order.shipToAddress, lineItemAttributes);
        } else {
          const deliveryAddress = this.order.shipToAddressFull as Address;
          this.addToNewOrder(sku, quantity, deliveryAddress, this.order.id, lineItemAttributes);
        }
      } else {
        const measurement = {
          width: this.productForm.get('measurementWidth').value,
          height: this.productForm.get('measurementHeight').value,
          diameter: this.productForm.get('measurementDiameter').value,
        };
        this.camCardsFacade.addProductToCamCard(this.rootCamCardId, sku, quantity, comment, measurement, 0, true);
        this.hide();
        this.resetFormValues();
      }
      this.requiresMeasurement = false;
    } else {
      markAsDirtyRecursive(this.productForm);
    }
  }

  addToExistingOrder(sku, quantity, shipToAddress, lineItemAttributes) {
    this.productFacade.addProductToBasket(sku, quantity, this.shippingMethodId, shipToAddress, lineItemAttributes);
  }

  addToNewOrder(sku, quantity, deliveryAddress, bucketId, lineItemAttributes) {
    if (this.isNewAddress(deliveryAddress)) {
      this.productFacade.addProductToBucket(
        deliveryAddress,
        this.order.shippingMethod,
        sku,
        quantity,
        this.order.basket,
        {
          ...this.order,
        },
        lineItemAttributes,
        bucketId
      );
    } else {
      this.productFacade.addProductToBucketWithUrn(
        this.getUrn(deliveryAddress),
        this.getId(deliveryAddress),
        this.order.shippingMethod,
        sku,
        quantity,
        this.order.basket,
        lineItemAttributes
      );
    }
  }

  getUrn(currentAddress: Address): string {
    return AddressHelper.getUrn(currentAddress, this.basketAddresses);
  }

  getId(currentAddress: Address): string {
    return AddressHelper.getId(currentAddress, this.basketAddresses);
  }

  isNewAddress(currentAddress: Address): boolean {
    return AddressHelper.isNewAddress(currentAddress, this.basketAddresses);
  }

  resetError() {
    this.showSkuError = false;
    this.product = undefined;
  }

  resetFormValues() {
    this.productForm.reset();
  }

  getField(name: string) {
    return this.productForm?.get(name);
  }

  /** close modal */
  hide() {
    this.modal?.close ? this.modal.close() : this.dialog.closeAll();
  }

  /** open modal */
  show() {
    return this.modalTemplate;
  }

  disableIfNoMeasurements(): boolean {
    return ProductHelper.disableIfNoMeasurements(this.product, this.productForm);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
