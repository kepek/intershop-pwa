import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { flatten } from 'lodash-es';
import { Subject, combineLatest } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { AddressHelper } from 'ish-core/models/address/address.helper';
import { Address } from 'ish-core/models/address/address.model';
import { AttributeHelper } from 'ish-core/models/attribute/attribute.helper';
import { BasketView } from 'ish-core/models/basket/basket.model';
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
  @Output() resetQuantityValue = new EventEmitter<void>();
  quantityForm: FormGroup;

  selectedOrderId: string;

  basketId: string;
  commonShippingMethodId: string;
  buckets = [];

  showSuccess = false;
  submitted = false;
  basketAddresses: Address[];
  isNewAddress = AddressHelper.isNewAddress;
  validateFilterArea = ProductHelper.validateFilterArea;
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

    combineLatest([
      this.checkoutFacade.buckets$.pipe(whenTruthy()),
      this.checkoutFacade.emptyBuckets$?.pipe(whenTruthy()),
    ])
      .pipe(whenTruthy(), takeUntil(this.destroy$))
      .subscribe(res => {
        this.buckets = flatten(res);
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

  onOrderClicked(orderId: string) {
    this.selectedOrderId = orderId;
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

    const filterAreaValidated = this.validateFilterArea(this.product, this.quantityForm);

    if (requiresMeasurement && !measurements && filterAreaValidated) {
      this.quantityForm.patchValue({ measurementErrorInfo: true });
      markAsDirtyRecursive(this.quantityForm);
      return;
    }

    if (this.quantityForm.valid && this.selectedOrderId && filterAreaValidated) {
      const currentBucket = this.buckets.find(bucket => bucket.id === this.selectedOrderId);

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
        this.resetFormValues();
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
        this.resetFormValues();
      }
    } else {
      markAsDirtyRecursive(this.quantityForm);
    }
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

  resetFormValues() {
    this.resetQuantityValue.emit();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
