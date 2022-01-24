import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModalAddNewProductComponent } from 'src/app/extensions/cam-cards/pages/account-cam-card-detail/modal-add-new-product/modal-add-new-product.component';

import { CamfilSmallCtaModalComponent } from 'ish-shared/components/common/camfil-small-cta-modal/camfil-small-cta-modal.component';

import { Requisition } from '../../models/requisition/requisition.model';

@Component({
  selector: 'camfil-requisition-detail-toolbar',
  templateUrl: './camfil-requisition-detail-toolbar.component.html',
  styleUrls: ['./camfil-requisition-detail-toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilRequisitionDetailToolbarComponent {
  @Input() requisition: Requisition;
  @Input() lineItemsChecked: string[];
  @Output() openAddToProductModal = new EventEmitter<any>();
  @Output() removeSelectedProducts = new EventEmitter();
  @Output() approveSelectedProducts = new EventEmitter();

  constructor(public dialog: MatDialog) {}

  showAddToProductModal(modal: ModalAddNewProductComponent) {
    this.openAddToProductModal.emit(modal);
  }

  openActionModal(modal: CamfilSmallCtaModalComponent) {
    this.dialog.open(modal.show());
    modal.hide = () => this.dialog.closeAll();
  }

  removeProducts(modal: CamfilSmallCtaModalComponent) {
    this.removeSelectedProducts.emit();
    modal.hide();
  }

  approveProducts(modal: CamfilSmallCtaModalComponent) {
    this.approveSelectedProducts.emit();
    modal.hide();
  }
}
