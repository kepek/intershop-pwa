import { ChangeDetectionStrategy, Component, Input, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { Bucket } from 'ish-core/models/basket/bucket.model';
import { CamfilSmallCtaModalComponent } from 'ish-shared/components/common/camfil-small-cta-modal/camfil-small-cta-modal.component';

import { CreateOrderProductModalComponent } from '../../../../extensions/cam-cards/shared/add-product-to-cart-modal/create-order-product-modal/create-order-product-modal.component';

@Component({
  selector: 'camfil-create-order-button',
  templateUrl: './create-order-button.component.html',
  styleUrls: ['./create-order-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateOrderButtonComponent {
  @Input() basketId: string;
  @Input() shippingMethodId: string;

  @ViewChild(CamfilSmallCtaModalComponent) modal: CamfilSmallCtaModalComponent;

  constructor(public dialog: MatDialog, private checkoutFacade: CheckoutFacade) {}

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
    };

    this.checkoutFacade.addEmptyBucket(bucket);
    this.dialog.closeAll();
    this.openSuccessModal();
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
