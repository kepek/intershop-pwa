import { animate, state, style, transition, trigger } from '@angular/animations';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { DeviceType } from 'ish-core/models/viewtype/viewtype.types';
import { ModalDialogComponent } from 'ish-shared/components/common/modal-dialog/modal-dialog.component';

import { CamCardsFacade } from '../../../facades/cam-cards.facade';
import { CamCard, CamCardItem } from '../../../models/cam-card/cam-card.model';

export interface ProductChecked {
  camCardId: string;
  camCardRoot: string;
  sku: string;
  count: number;
}

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
export class AccountCamCardListComponent implements OnInit, OnChanges, OnDestroy {
  /** The list of cam cards of the customer. */
  @Input() camCards: CamCard[];
  @Input() deviceType: DeviceType;
  /** Emits the id of the cam cards, which is to be deleted. */
  @Output() deleteCamCard = new EventEmitter<string>();
  @Output() addCamCard = new EventEmitter<CamCard>();
  isStickyCamCardToolbar$: Observable<boolean>;

  dummyProduct = { sku: 'dummy', inStock: true, availability: true };
  private destroy$ = new Subject();

  camCardsProcessed: MatTableDataSource<CamCard>;
  columnsToDisplay = [
    'name',
    'customer',
    'lastDelivery',
    'orderInterval',
    'nextDelivery',
    // 'creationDate',
    'itemsCount',
    'userAccess',
    'edit',
    'checkbox',
  ];
  expandedCamCard: CamCard | null;
  productsChecked = {};
  isMobileView = false;

  isSubOpen = [];
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private translate: TranslateService,
    private productFacade: ShoppingFacade,
    private camCardsFacade: CamCardsFacade,
    private changeDetectorRefs: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.isMobileView = this.isMobile();
    this.isStickyCamCardToolbar$ = this.camCardsFacade.isStickyCamCardToolbar$;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.camCards) {
      this.camCardsProcessed = new MatTableDataSource(this.camCards);
      this.changeDetectorRefs.detectChanges();

      this.camCardsProcessed.filterPredicate = (data, filter) => {
        const filtered = this.simplifyData(filter);
        return (
          this.simplifyData(data.customer.name).indexOf(filtered) !== -1 ||
          this.simplifyData(data.name).indexOf(filtered) !== -1
        );
      };
      this.camCardsProcessed.sort = this.sort;
      this.camCardsProcessed.sortingDataAccessor = (item, property) =>
        property === 'customer' ? item.customer.name : item[property];
    }
    this.isMobileView = this.isMobile();
  }

  simplifyData(data) {
    return data.toLowerCase().trim();
  }

  isMobile() {
    return this.deviceType === 'mobile'; // || this.deviceType === 'tablet';
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

  /** addToCartItems */
  addSelectedItemsToCart() {
    Object.values(this.productsChecked).forEach((val: ProductChecked) =>
      this.productFacade.addProductToBasket(val.sku, val.count)
    );
  }

  /** Emits the id of the cam cards to delete. */
  delete(camCardId: string) {
    this.deleteCamCard.emit(camCardId);
  }
  /** Emits the camCard to add new one. */
  add(camCard: CamCard) {
    this.addCamCard.emit(camCard);
  }

  /** Determine the heading of the delete modal and opens the modal. */
  openDeleteConfirmationDialog(camCard: CamCard, modal: ModalDialogComponent<string>) {
    this.translate
      .get('camfil.account.cam_cards.delete_dialog.header', { 0: camCard.name })
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
    return this.productsChecked[id];
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
    return Object.keys(this.productsChecked).length !== 0 && !this.isAllChecked();
  }

  isCamCardIndeterminate(camCard: CamCard) {
    const itmsNum = camCard.subCamCards
      ? camCard.subCamCards.filter(sub => sub.camCardItems.filter(item => this.isProductChecked(item.id)).length).length
      : 0 + camCard.camCardItems.filter(item => this.isProductChecked(item.id)).length;
    return itmsNum > 0 && !this.isCamCardChecked(camCard);
  }

  handleProductCheck(item: CamCardItem, camCard: CamCard, event: MatCheckboxChange) {
    const productOnList = this.productsChecked[item.id];
    if (event.checked && !productOnList) {
      const element: ProductChecked = {
        camCardId: camCard.id,
        camCardRoot: camCard.rootCamCard,
        sku: item.product.sku,
        count: item.count,
      };
      this.productsChecked[item.id] = element;
    } else if (!event.checked && productOnList) {
      delete this.productsChecked[item.id];
    }
  }

  handleProductsCheck(camCard: CamCard, event: MatCheckboxChange) {
    camCard.camCardItems.forEach(item => this.handleProductCheck(item, camCard, event));
    camCard.subCamCards.forEach(subCamCard => {
      subCamCard.camCardItems.forEach(item => this.handleProductCheck(item, camCard, event));
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

  handleProductCheckbox(item: CamCardItem, camCard: CamCard, event: MatCheckboxChange) {
    this.handleProductCheck(item, camCard, event);
  }
}
