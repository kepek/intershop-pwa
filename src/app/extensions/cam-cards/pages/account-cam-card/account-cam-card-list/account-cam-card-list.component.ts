import { animate, state, style, transition, trigger } from '@angular/animations';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { ModalDialogComponent } from 'ish-shared/components/common/modal-dialog/modal-dialog.component';

import { CamCard, CamCardItem } from '../../../models/cam-card/cam-card.model';

@Component({
  selector: 'camfil-account-cam-card-list',
  templateUrl: './account-cam-card-list.component.html',
  styleUrls: ['./account-cam-card-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class AccountCamCardListComponent implements OnChanges, OnDestroy {
  /** The list of cam cards of the customer. */
  @Input() camCards: CamCard[];
  /** Emits the id of the cam cards, which is to be deleted. */
  @Output() deleteCamCard = new EventEmitter<string>();

  dummyProduct = { sku: 'dummy', inStock: true, availability: true };
  private destroy$ = new Subject();

  camCardsProcessed: MatTableDataSource<CamCard>;
  columnsToDisplay = ['title', 'customer', 'creationDate', 'itemsCount', 'actions', 'checkbox'];
  expandedElement: CamCard | null;
  productsChecked = [];
  isSubOpen = [];
  @ViewChild(MatSort) sort: MatSort;

  constructor(private translate: TranslateService, private productFacade: ShoppingFacade) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.camCards) {
      this.camCardsProcessed = new MatTableDataSource(this.camCards);
    }
  }

  isSubCamCardOpen(id: string) {
    return this.isSubOpen.indexOf(id) > -1;
  }

  toggleSubCamCard(id: string) {
    const index = this.isSubOpen.indexOf(id);
    this.isSubCamCardOpen(id) ? this.isSubOpen.splice(index, 1) : this.isSubOpen.push(id);
  }

  addCamCardToCart(camCardId: string) {
    const items = this.camCards.find(t => t.id === camCardId).camCardItems
      ? this.camCards.find(t => t.id === camCardId).camCardItems
      : [];

    if (items.length > 0) {
      items.forEach(item => {
        this.productFacade.addProductToBasket(item.product.sku, item.count);
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

  applyfilters(filter) {
    this.camCardsProcessed.filter = filter;
  }

  /** checkboxes */
  isProductChecked(id: string) {
    return this.productsChecked.indexOf(id) > -1;
  }

  isCamCardChecked(camCard: CamCard) {
    return (
      camCard.camCardItems.every(item => this.isProductChecked(item.id)) &&
      camCard.subCamCards.every(subCard => subCard.camCardItems.every(item => this.isProductChecked(item.id)))
    );
  }

  isAllChecked() {
    return this.camCardsProcessed.data.every(camCard => this.isCamCardChecked(camCard));
  }

  isAllIndeterminate() {
    return this.productsChecked.length > 0 && !this.isAllChecked();
  }

  isCamCardIndeterminate(camCard: CamCard) {
    const itmsNum =
      camCard.subCamCards.filter(subCard => subCard.camCardItems.filter(item => this.isProductChecked(item.id)).length)
        .length + camCard.camCardItems.filter(item => this.isProductChecked(item.id)).length;
    return itmsNum > 0 && !this.isCamCardChecked(camCard);
  }

  handleProductCheck(item: CamCardItem, event: MatCheckboxChange) {
    const index = this.productsChecked.indexOf(item.id);
    if (event.checked && index === -1) {
      this.productsChecked.push(item.id);
    } else if (!event.checked && index > -1) {
      this.productsChecked.splice(index, 1);
    }
  }

  handleProductsCheck(camCard: CamCard, event: MatCheckboxChange) {
    camCard.camCardItems.forEach(item => this.handleProductCheck(item, event));
    camCard.subCamCards.forEach(subCamCard => {
      subCamCard.camCardItems.forEach(item => this.handleProductCheck(item, event));
    });
  }

  masterToggle(event: MatCheckboxChange) {
    this.camCardsProcessed.data.forEach(row => {
      this.handleProductsCheck(row, event);
    });
  }

  camCardToggle(camCard: CamCard, event: MatCheckboxChange) {
    this.handleProductsCheck(camCard, event);
  }

  handleProductCheckbox(item: CamCardItem, event: MatCheckboxChange) {
    this.handleProductCheck(item, event);
  }
}
