import { ChangeDetectionStrategy, Component, Input, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { Bucket } from 'ish-core/models/basket/bucket.model';
import { CamfilSmallCtaModalComponent } from 'ish-shared/components/common/camfil-small-cta-modal/camfil-small-cta-modal.component';

import { CamCard } from '../../../../extensions/cam-cards/models/cam-card/cam-card.model';
import { CreateOrderModalComponent } from '../../../../extensions/cam-cards/shared/add-to-cart-modal/create-order-modal/create-order-modal.component';

@Component({
  selector: 'camfil-create-order-button',
  templateUrl: './create-order-button.component.html',
  styleUrls: ['./create-order-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateOrderButtonComponent {
  @Input() basketId: string;

  @ViewChild(CamfilSmallCtaModalComponent) modal: CamfilSmallCtaModalComponent;

  constructor(public dialog: MatDialog, private checkoutFacade: CheckoutFacade) {}

  createVirtualOrder(virtualCamCard: CamCard) {
    const bucket: Bucket = {
      basket: this.basketId,
      id: '',
      lineItems: [],
      shipToAddress: virtualCamCard.deliveryAddress?.urn,
      deliveryAddressId: virtualCamCard.deliveryAddress?.id,
      shipToAddressFull: virtualCamCard.deliveryAddress,
      orderName: virtualCamCard.name,
      nextDelivery: virtualCamCard.nextDeliveryDate,
      orderMark: virtualCamCard.orderLabel,
      customer: virtualCamCard.customer,
      contacts: virtualCamCard.contacts,
      transient: true,
    };

    this.checkoutFacade.addEmptyBucket(bucket);
    this.dialog.closeAll();
    this.openSuccessModal();
  }

  openModal(modal: CreateOrderModalComponent) {
    this.dialog.open(modal.show());
    modal.hide = () => this.dialog.closeAll();
  }

  openSuccessModal() {
    this.dialog.open(this.modal?.show());
    this.modal.hide = () => this.dialog.closeAll();
  }
}
