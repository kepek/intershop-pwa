import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import { CamCardsFacade } from '../../../facades/cam-cards.facade';
import { ModalAddNewProductComponent } from '../modal-add-new-product/modal-add-new-product.component';
import { ProductAddFormData } from '../modal-add-new-product/productAddFormData.model';

@Component({
  selector: 'camfil-account-cam-card-detail-toolbar',
  templateUrl: './account-cam-card-detail-toolbar.component.html',
  styleUrls: ['./account-cam-card-detail-toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountCamCardDetailToolbarComponent implements OnInit {
  constructor(private camCardsFacade: CamCardsFacade, public dialog: MatDialog) {}

  private destroy$ = new Subject<void>();

  @Output() deleteCamCard = new EventEmitter();
  @Output() addItemsToCart = new EventEmitter();
  @Output() addItemsToCamCard = new EventEmitter<ProductAddFormData>();
  @Input() isSticky: boolean;
  @Input() title: string;

  eventsSubject: Subject<void> = new Subject<void>();

  openAddToProductModal(modal: ModalAddNewProductComponent) {
    const dialogRef = this.dialog.open(modal.show());
    modal.hide = () => this.dialog.closeAll();

    dialogRef
      .afterClosed()
      .pipe(take(1), takeUntil(this.destroy$))
      .subscribe(() => {
        modal.reset();
      });
  }

  emitEventToChild() {
    this.eventsSubject.next();
  }

  ngOnInit() {
    this.camCardsFacade.detectCamCardToolbar();
  }

  addToCart() {
    this.addItemsToCart.emit();
  }

  /** Emits the cam card to delete. */
  deleteCurrentCamCard() {
    this.deleteCamCard.emit();
  }

  addItemsToCurrentCamCard(quickAddData: ProductAddFormData, modal: ModalAddNewProductComponent) {
    this.addItemsToCamCard.emit(quickAddData);
    if (modal) {
      modal.hide();
      modal.reset();
    }
  }
}
