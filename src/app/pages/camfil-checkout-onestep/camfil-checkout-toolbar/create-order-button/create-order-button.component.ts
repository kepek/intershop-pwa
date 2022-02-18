import { ChangeDetectionStrategy, Component, Input, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { Bucket } from 'ish-core/models/bucket/bucket.model';
import { whenTruthy } from 'ish-core/utils/operators';
import { CamfilSmallCtaModalComponent } from 'ish-shared/components/common/camfil-small-cta-modal/camfil-small-cta-modal.component';

import { CreateOrderProductModalComponent } from '../../../../extensions/cam-cards/shared/add-product-to-cart-modal/create-order-product-modal/create-order-product-modal.component';
import { CamfilConfigurationFacade } from '../../../../extensions/cam-configuration/facades/camfil-configuration.facade';

@Component({
  selector: 'camfil-create-order-button',
  templateUrl: './create-order-button.component.html',
  styleUrls: ['./create-order-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateOrderButtonComponent {
  @Input() basketId: string;
  @Input() shippingMethodId: string;
  @Input() isGuestCheckout = false;

  @ViewChild(CamfilSmallCtaModalComponent) modal: CamfilSmallCtaModalComponent;

  constructor(
    public dialog: MatDialog,
    private checkoutFacade: CheckoutFacade,
    private shoppingFacade: ShoppingFacade,
    private camfilConfigurationFacade: CamfilConfigurationFacade
  ) {}

  createVirtualOrder(virtualBucket: Bucket) {
    const bucket: Bucket = {
      contactPerson: virtualBucket.contactPerson,
      basket: this.basketId,
      id: `emptyBucket_${Date.now()}`,
      lineItems: [],
      shipToAddress: virtualBucket.shippingAddress?.urn,
      shipToAddressFull: virtualBucket.shippingAddress,
      orderMark: virtualBucket.orderMark,
      invoiceLabel: virtualBucket.invoiceLabel,
      customer: virtualBucket.customer,
      shippingMethod: this.shippingMethodId,
      phoneNumber: virtualBucket.phoneNumber,
      info: virtualBucket.info,
      totals: undefined,
    };

    this.checkoutFacade.addEmptyBucket(bucket);
    this.dialog.closeAll();
    this.openSuccessModal();
  }

  createGuestOrder() {
    combineLatest([
      this.camfilConfigurationFacade.isEnabled$('guestCheckout'),
      this.checkoutFacade.basket$.pipe(map(basket => !!basket?.id)),
    ])
      .pipe(
        map(([isGuestCheckout, hasBasketId]) => isGuestCheckout && !hasBasketId),
        whenTruthy()
      )
      .subscribe(() => {
        this.shoppingFacade.createBasket$();
      });
  }

  openModal(modal: CreateOrderProductModalComponent) {
    this.dialog.open(modal.show());
    modal.hide = () => this.dialog.closeAll();
  }

  openSuccessModal() {
    this.dialog.open(this.modal?.show());
    this.modal.hide = () => this.dialog.closeAll();
  }
}
