import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { ModalDialogComponent } from 'ish-shared/components/common/modal-dialog/modal-dialog.component';

import { CamCard } from '../../../models/cam-card/cam-card.model';

@Component({
  selector: 'camfil-account-cam-card-list',
  templateUrl: './account-cam-card-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountCamCardListComponent implements OnDestroy {
  /**
   * The list of cam cards of the customer.
   */
  @Input() camCards: CamCard[];
  /**
   * Emits the id of the cam cards, which is to be deleted.
   */
  @Output() deleteCamCard = new EventEmitter<string>();

  dummyProduct = { sku: 'dummy', inStock: true, availability: true };
  private destroy$ = new Subject();

  constructor(private translate: TranslateService, private productFacade: ShoppingFacade) {}

  addCamCardToCart(camCardId: string) {
    const products = this.camCards.find(t => t.id === camCardId).items
      ? this.camCards.find(t => t.id === camCardId).items
      : [];

    if (products.length > 0) {
      products.forEach(product => {
        this.productFacade.addProductToBasket(product.sku, product.desiredQuantity.value);
      });
    }
  }

  /** Emits the id of the cam cards to delete. */
  delete(camCardId: string) {
    this.deleteCamCard.emit(camCardId);
  }

  /** Determine the heading of the delete modal and opens the modal. */
  openDeleteConfirmationDialog(camCard: CamCard, modal: ModalDialogComponent<string>) {
    this.translate
      .get('camfil.account.cam_cards.delete_dialog.header', { 0: camCard.title })
      .pipe(take(1), takeUntil(this.destroy$))
      .subscribe(res => (modal.options.titleText = res));

    modal.show(camCard.id);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
