import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { BasketView } from 'ish-core/models/basket/basket.model';
import { Bucket } from 'ish-core/models/basket/bucket.model';
import { Product } from 'ish-core/models/product/product.model';
import { whenTruthy } from 'ish-core/utils/operators';
import { markAsDirtyRecursive } from 'ish-shared/forms/utils/form-utils';

import { CreateOrderModalComponent } from './create-order-modal/create-order-modal.component';

@Component({
  selector: 'camfil-add-to-cart-modal',
  templateUrl: './add-to-cart-modal.component.html',
  styleUrls: ['./add-to-cart-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddToCartModalComponent implements OnInit, OnDestroy {
  modal: NgbModalRef;

  @ViewChild('modal', { static: false }) modalTemplate: TemplateRef<unknown>;

  @Input() product: Product;
  quantityForm: FormGroup;

  selectedOrderId: string;

  basketId: string;
  commonShippingMethodId: string;
  buckets: Bucket[];

  showSuccess = false;
  submitted = false;

  private destroy$ = new Subject<void>();

  constructor(
    public dialog: MatDialog,
    private checkoutFacade: CheckoutFacade,
    private shoppingFacade: ShoppingFacade
  ) {}

  ngOnInit() {
    this.initBasket();

    this.quantityForm = new FormGroup({
      quantity: new FormControl(this.product.minOrderQuantity),
      boxLabel: new FormControl('', Validators.maxLength(60)),
    });

    this.shoppingFacade.productUpdated$.pipe(whenTruthy(), takeUntil(this.destroy$)).subscribe(() => {
      this.showSuccess = true;
    });
  }

  initBasket() {
    this.checkoutFacade.basket$.pipe(whenTruthy(), takeUntil(this.destroy$)).subscribe((basket: BasketView) => {
      this.basketId = basket.id;
      this.commonShippingMethodId = basket.commonShippingMethod?.id;
    });

    this.checkoutFacade.buckets$.pipe(whenTruthy(), takeUntil(this.destroy$)).subscribe((buckets: Bucket[]) => {
      this.buckets = buckets;
    });
  }

  onOrderClicked(orderId: string) {
    this.selectedOrderId = orderId;
  }

  openCreateOrderModal(modal: CreateOrderModalComponent) {
    this.dialog.open(modal.show());
    modal.hide = () => this.dialog.closeAll();
  }

  addToOrder() {
    if (this.quantityForm.valid && this.selectedOrderId) {
      const quantity = this.quantityForm.get('quantity').value;
      const boxLabel = this.quantityForm.get('boxLabel').value;
      const currentBucket = this.buckets.find(bucket => bucket.id === this.selectedOrderId);

      this.submitted = true;

      this.shoppingFacade.addProductToBucketWithUrn(
        currentBucket.shipToAddress,
        this.commonShippingMethodId,
        currentBucket.shipToAddressFull.id,
        this.product.sku,
        quantity,
        this.basketId,
        {
          boxLabel,
          contactPerson: currentBucket.contactPerson,
        }
      );
    } else {
      markAsDirtyRecursive(this.quantityForm);
    }
  }

  /** close modal */
  hide() {
    this.modal.close();
  }

  /** open modal */
  show() {
    this.showSuccess = false;
    return this.modalTemplate;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
