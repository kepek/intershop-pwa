import { ChangeDetectionStrategy, Component, Input, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { Bucket } from 'ish-core/models/bucket/bucket.model';
import { EMPTY_BUCKET_PREFIX } from 'ish-core/store/customer/basket/basket-items.effects';
import { CamfilSmallCtaModalComponent } from 'ish-shared/components/common/camfil-small-cta-modal/camfil-small-cta-modal.component';

@Component({
  selector: 'camfil-delete-order',
  styleUrls: ['./camfil-delete-order.component.scss'],
  templateUrl: './camfil-delete-order.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilDeleteOrderComponent {
  @ViewChild(CamfilSmallCtaModalComponent) modal: CamfilSmallCtaModalComponent;

  @Input() order: Bucket;

  constructor(public dialog: MatDialog, private checkoutFacade: CheckoutFacade) {}

  openModal() {
    this.dialog.open(this.modal.show());
    this.modal.hide = () => this.dialog.closeAll();
  }

  deleteOrder() {
    const type = this.order.id.split('_')[0];

    type === EMPTY_BUCKET_PREFIX
      ? this.checkoutFacade.deleteEmptyBucket(this.order.id)
      : this.checkoutFacade.deleteOrder(this.order.basket, this.order.shipToAddressFull.id);
    this.modal.hide();
  }
}
