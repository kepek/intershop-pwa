import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { AddressHelper } from 'ish-core/models/address/address.helper';
import { Address } from 'ish-core/models/address/address.model';
import { Bucket } from 'ish-core/models/basket/bucket.model';
import { ProductView } from 'ish-core/models/product-view/product-view.model';
import { Product, ProductCompletenessLevel } from 'ish-core/models/product/product.model';
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

  private destroy$ = new Subject();
  basketAddresses: Address[];

  validators = ADD_NEW_PRODUCT_VALIDATORS;

  @ViewChild('modal', { static: false }) modalTemplate: TemplateRef<unknown>;

  ngOnInit() {
    this.currentCamCard$ = this.camCardsFacade.currentCamCard$;

    this.currentCamCard$?.pipe(takeUntil(this.destroy$)).subscribe(camCard => {
      if (camCard) {
        this.rootCamCardId = camCard.id;
      }
    });

    this.productForm = new FormGroup({
      quantity: new FormControl(1),
      sku: new FormControl('', [Validators.required]),
      boxLabel: new FormControl('', [Validators.max(10)]),
    });

    this.productFacade.basketAddresses$.pipe(takeUntil(this.destroy$)).subscribe((basketAddresses: Address[]) => {
      this.basketAddresses = basketAddresses;
    });

    this.productFacade.productUpdated$.pipe(whenTruthy(), takeUntil(this.destroy$)).subscribe(() => {
      this.loading = false;
      this.hide();
    });

    this.productFacade.productAdded$.pipe(whenTruthy(), takeUntil(this.destroy$)).subscribe(() => {
      this.loading = false;
      this.hide();
    });
  }

  isSkuValid = () => !this.product.failed && this.product.availability;

  validateSku() {
    const sku = this.productForm.get('sku').value;

    if (sku) {
      this.loading = true;
      this.product$ = this.productFacade.product$(sku, ModalAddNewProductComponent.REQUIRED_COMPLETENESS_LEVEL);

      this.product$.pipe(takeUntil(this.destroy$)).subscribe(product => {
        this.loading = false;
        this.product = product;
        this.showSkuError = !this.isSkuValid();

        if (this.isSkuValid()) {
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
    if (this.productForm.valid) {
      const sku = this.getField('sku') ? String(this.getField('sku').value) : undefined;
      const quantity = this.getField('quantity') ? Number(this.getField('quantity')?.value) : 1;
      const label = this.getField('boxLabel') ? String(this.getField('boxLabel').value) : undefined;
      const comment: CamCardItemComment = { label };

      if (this.addToOrder) {
        this.loading = true;

        if (this.order.id && this.order.shipToAddress) {
          this.addToExistingOrder(sku, quantity, this.order.shipToAddress);
        } else {
          const deliveryAddress = this.order.shipToAddressFull as Address;
          this.addToNewOrder(sku, quantity, deliveryAddress);
        }
      } else {
        this.camCardsFacade.addProductToCamCard(this.rootCamCardId, sku, quantity, comment, 0, true);
        this.hide();
      }
    } else {
      markAsDirtyRecursive(this.productForm);
    }
  }

  addToExistingOrder(sku, quantity, shipToAddress) {
    this.productFacade.addProductToBasket(sku, quantity, this.shippingMethodId, shipToAddress);
  }

  addToNewOrder(sku, quantity, deliveryAddress) {
    if (this.isNewAddress(deliveryAddress)) {
      this.productFacade.addProductToBucket(
        deliveryAddress,
        this.order.shippingMethod,
        sku,
        quantity,
        this.order.basket,
        {
          ...this.order,
        }
      );
    } else {
      this.productFacade.addProductToBucketWithUrn(
        this.getUrn(deliveryAddress),
        this.order.shippingMethod,
        this.getId(deliveryAddress),
        sku,
        quantity,
        this.order.basket,
        { ...this.order }
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

  getField(name: string) {
    return this.productForm.get(name);
  }

  /** close modal */
  hide() {
    this.modal?.close ? this.modal.close() : this.dialog.closeAll();
  }

  /** open modal */
  show() {
    return this.modalTemplate;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
