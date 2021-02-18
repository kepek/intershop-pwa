import { ChangeDetectionStrategy, Component, Input, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { Bucket } from 'ish-core/models/basket/bucket.model';
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
  loading = false;

  constructor(public dialog: MatDialog, private checkoutFacade: CheckoutFacade) {}

  openModal() {
    this.dialog.open(this.modal.show());
    this.modal.hide = () => this.dialog.closeAll();
  }

  deleteOrder() {
    this.loading = true;
    this.checkoutFacade.deleteOrder(this.order.basket, this.order.id);
    this.modal.hide();
  }
}
