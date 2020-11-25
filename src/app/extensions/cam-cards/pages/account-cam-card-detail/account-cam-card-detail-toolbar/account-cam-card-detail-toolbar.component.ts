import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';

import { CamCardsFacade } from '../../../facades/cam-cards.facade';
import { ModalAddNewProductComponent } from '../modal-add-new-product/modal-add-new-product.component';

@Component({
  selector: 'camfil-account-cam-card-detail-toolbar',
  templateUrl: './account-cam-card-detail-toolbar.component.html',
  styleUrls: ['./account-cam-card-detail-toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountCamCardDetailToolbarComponent implements OnInit {
  constructor(private camCardsFacade: CamCardsFacade, public dialog: MatDialog) {}

  @Output() deleteCamCard = new EventEmitter();
  @Output() addItemsToCart = new EventEmitter();
  @Input() isSticky: boolean;
  @Input() title: string;

  dummyProduct = { sku: 'dummy', inStock: true, availability: true };

  eventsSubject: Subject<void> = new Subject<void>();

  openAddToProductModal(modal: ModalAddNewProductComponent) {
    this.dialog.open(modal.show());
    modal.hide = () => this.dialog.closeAll();
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
}
