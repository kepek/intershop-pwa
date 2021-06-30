import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { AddressHelper } from 'ish-core/models/address/address.helper';
import { Address } from 'ish-core/models/address/address.model';
import { AttributeHelper } from 'ish-core/models/attribute/attribute.helper';
import { BasketView } from 'ish-core/models/basket/basket.model';
import { Bucket } from 'ish-core/models/basket/bucket.model';
import { Product, ProductHelper } from 'ish-core/models/product/product.model';
import { whenTruthy } from 'ish-core/utils/operators';
import { markAsDirtyRecursive } from 'ish-shared/forms/utils/form-utils';

import { CreateOrderProductModalComponent } from './create-order-product-modal/create-order-product-modal.component';

@Component({
  selector: 'camfil-add-product-to-cart-modal',
  templateUrl: './add-product-to-cart-modal.component.html',
  styleUrls: ['./add-product-to-cart-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddProductToCartModalComponent implements OnInit, OnDestroy {
  modal: NgbModalRef;

  @ViewChild('modal', { static: false }) modalTemplate: TemplateRef<unknown>;
  @Input() quantity: number;
  @Input() product: Product;
  @Input() boxLabel: string;
  quantityForm: FormGroup;

  selectedOrderId: string;
  isEmptyBucketSelected = false;

  basketId: string;
  commonShippingMethodId: string;
  buckets: Bucket[];
  emptyBuckets: Bucket[];

  showSuccess = false;
  submitted = false;
  basketAddresses: Address[];
  private destroy$ = new Subject<void>();

  constructor(
    public dialog: MatDialog,
    protected checkoutFacade: CheckoutFacade,
    protected shoppingFacade: ShoppingFacade
  ) {}

  ngOnInit() {
    this.init();
  }

  protected init() {
    this.initBasket();
    this.initQuantityForm();
    this.initProductUpdatedSubscription();
  }

  initBasket() {
    this.checkoutFacade.basket$.pipe(whenTruthy(), takeUntil(this.destroy$)).subscribe((basket: BasketView) => {
      this.basketId = basket.id;
      this.commonShippingMethodId = basket.commonShippingMethod?.id;
    });

    this.checkoutFacade.buckets$.pipe(whenTruthy(), takeUntil(this.destroy$)).subscribe((buckets: Bucket[]) => {
      this.buckets = buckets;
    });

    this.checkoutFacade.emptyBuckets$?.pipe(takeUntil(this.destroy$)).subscribe(emptyBuckets => {
      this.emptyBuckets = emptyBuckets;
    });

    this.shoppingFacade.basketAddresses$.pipe(takeUntil(this.destroy$)).subscribe((basketAddresses: Address[]) => {
      this.basketAddresses = basketAddresses;
    });
  }

  initQuantityForm() {
    this.quantityForm = new FormGroup({
      quantity: new FormControl(this.quantity || this.product?.minOrderQuantity || 0),
      boxLabel: new FormControl(this.boxLabel || '', Validators.maxLength(40)),
      measurementWidth: new FormControl(),
      measurementHeight: new FormControl(),
      measurementDiameter: new FormControl(),
      measurementErrorInfo: new FormControl(),
    });
  }

  initProductUpdatedSubscription() {
    this.shoppingFacade.productUpdated$.pipe(whenTruthy(), takeUntil(this.destroy$)).subscribe(() => {
      this.showSuccess = true;
    });
  }

  onOrderClicked(orderId: string, isEmptyBucketSelected?: boolean) {
    this.selectedOrderId = orderId;
    this.isEmptyBucketSelected = isEmptyBucketSelected;
  }

  openCreateOrderModal(modal: CreateOrderProductModalComponent) {
    this.dialog.open(modal.show());
    modal.hide = () => this.dialog.closeAll();
  }

  addToOrder() {
    const requiresMeasurement = ProductHelper.getRequiresMeasurement(this.product);
    const measurements =
      (this.quantityForm.get('measurementWidth')?.value && this.quantityForm.get('measurementHeight')?.value) ||
      this.quantityForm.get('measurementDiameter')?.value;

    if (requiresMeasurement && !measurements) {
      this.quantityForm.patchValue({ measurementErrorInfo: true });
      markAsDirtyRecursive(this.quantityForm);
      return;
    }

    if (this.quantityForm.valid && this.selectedOrderId) {
      const currentBucket = this.isEmptyBucketSelected
        ? this.emptyBuckets.find(emptyBucket => emptyBucket.id === this.selectedOrderId)
        : this.buckets.find(bucket => bucket.id === this.selectedOrderId);

      const quantity = this.quantityForm.get('quantity').value;
      const lineItemAttributes = AttributeHelper.calculateAttrsToAddFromForm(this.quantityForm);

      this.submitted = true;
      if (this.isNewAddress(currentBucket.shipToAddressFull, this.basketAddresses)) {
        this.shoppingFacade.addProductToBucket(
          currentBucket.shipToAddressFull,
          this.commonShippingMethodId,
          this.product.sku,
          quantity,
          this.basketId,
          {
            ...currentBucket,
          },
          undefined,
          currentBucket.id
        );
      } else {
        this.shoppingFacade.addProductToBucketWithUrn(
          currentBucket.shipToAddress,
          currentBucket.shipToAddressFull.id,
          this.commonShippingMethodId,
          this.product.sku,
          quantity,
          this.basketId,
          lineItemAttributes
        );
      }
    } else {
      markAsDirtyRecursive(this.quantityForm);
    }
  }

  isNewAddress(currentAddress: Address, basketAddresses: Address[]): boolean {
    return AddressHelper.isNewAddress(currentAddress, basketAddresses);
  }

  disableIfNoMeasurements(): boolean {
    return ProductHelper.disableIfNoMeasurements(this.product, this.quantityForm);
  }

  /** close modal */
  hide() {
    this.dialog.closeAll();
  }

  hideSearchDialog() {
    this.shoppingFacade.hideSearchBox();
  }

  /** open modal */
  show() {
    this.quantityForm?.controls.quantity.setValue(this.quantity);
    this.quantityForm?.controls.boxLabel.setValue('');
    this.showSuccess = false;
    this.submitted = false;
    return this.modalTemplate;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
