import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { QuickAddProduct } from 'camfil-pwa/models/camfil-quick-add-product/camfil-quick-add-product.model';
import { ModalAddNewProductComponent } from 'src/app/extensions/cam-cards/pages/account-cam-card-detail/modal-add-new-product/modal-add-new-product.component';

import { CamfilSmallCtaModalComponent } from 'ish-shared/components/common/camfil-small-cta-modal/camfil-small-cta-modal.component';

import { CamfilRequisition } from '../../models/camfil-requisition/camfil-requisition.model';

@Component({
  selector: 'camfil-requisition-detail-toolbar',
  templateUrl: './camfil-requisition-detail-toolbar.component.html',
  styleUrls: ['./camfil-requisition-detail-toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilRequisitionDetailToolbarComponent {
  @Input() requisition: CamfilRequisition;
  @Input() lineItemsChecked: string[];
  @Output() openAddToProductModal = new EventEmitter<any>();
  @Output() removeSelectedProducts = new EventEmitter();
  @Output() approveSelectedProducts = new EventEmitter();
  @Output() addProductToRequisition = new EventEmitter<QuickAddProduct>();

  constructor(public dialog: MatDialog, private cdr: ChangeDetectorRef) {}

  get isLineItemsChecked() {
    return this.lineItemsChecked.length;
  }

  showAddToProductModal(modal: ModalAddNewProductComponent) {
    this.dialog.open(modal.show());
    modal.hide = () => this.dialog.closeAll();
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

  quickAddProductToRequisition(quickAddData: QuickAddProduct, modal: ModalAddNewProductComponent) {
    this.addProductToRequisition.emit(quickAddData);
    if (modal) {
      modal.hide();
      modal.reset();
    }
  }
}
