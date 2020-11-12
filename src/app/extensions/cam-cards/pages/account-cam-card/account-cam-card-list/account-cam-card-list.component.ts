import { animate, state, style, transition, trigger } from '@angular/animations';
import { ViewportScroller } from '@angular/common';
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
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { DeviceType } from 'ish-core/models/viewtype/viewtype.types';
import { ModalDialogComponent } from 'ish-shared/components/common/modal-dialog/modal-dialog.component';

import { CamCardsFacade } from '../../../facades/cam-cards.facade';
import { CamCardHelper } from '../../../models/cam-card/cam-card.helper';
import { CamCard, CamCardItem } from '../../../models/cam-card/cam-card.model';
import { MoveCamCardDialogComponent } from '../../../shared/move-cam-card-dialog/move-cam-card-dialog.component';
import { UserAccessCamCardDialogComponent } from '../../../shared/user-access-cam-card-dialog/user-access-cam-card-dialog.component';

export interface ProductChecked {
  camCardId: string;
  camCardRoot: string;
  sku: string;
  quantity: number;
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
  @ViewChild(MatSort) sort: MatSort;

  dummyProduct = { sku: 'dummy', inStock: true, availability: true };

  isStickyCamCardToolbar$: Observable<boolean>;
  camCardsProcessed: MatTableDataSource<CamCard>;
  columnsToDisplay = [
    'name',
    'customer',
    'lastDeliveryDate',
    'deliveryInterval',
    'nextDeliveryDate',
    'itemsCount',
    'edit',
    'checkbox',
  ];
  expandedCamCard: CamCard | undefined;
  productsChecked = {};
  isMobileView = false;
  loading = true;
  isSubOpen = [];
  maintenance = CamCardHelper.maintenance;
  private fragment: string;

  private destroy$ = new Subject();

  constructor(
    private translate: TranslateService,
    private productFacade: ShoppingFacade,
    private camCardsFacade: CamCardsFacade,
    private changeDetectorRefs: ChangeDetectorRef,
    public dialog: MatDialog,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private scroller: ViewportScroller
  ) {}

  ngOnInit() {
    if (this.isCustomerAdmin()) {
      this.columnsToDisplay.splice(6, 0, 'userAccess');
    }
    this.isMobileView = this.isMobile();
    this.isStickyCamCardToolbar$ = this.camCardsFacade.isStickyCamCardToolbar$;

    this.activatedRoute.fragment.pipe(take(1)).subscribe((fragment: string) => {
      this.fragment = fragment;
      this.goToExpandedCamCard();
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.camCards) {
      this.camCardsProcessed = new MatTableDataSource(this.camCards);
      this.changeDetectorRefs.detectChanges();

      this.camCardsProcessed.filterPredicate = (data, filter) => {
        const filtered = this.simplifyData(filter);
        return (
          this.simplifyData(data.customer.companyName).indexOf(filtered) !== -1 ||
          this.simplifyData(data.name).indexOf(filtered) !== -1
        );
      };
      this.camCardsProcessed.sort = this.sort;
      this.camCardsProcessed.sortingDataAccessor = (item, property) =>
        property === 'customer' ? item.customer.companyName : item[property];

      this.goToExpandedCamCard();
      this.loading = !this.camCardsProcessed.data.length;
    }
    this.isMobileView = this.isMobile();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  simplifyData(data) {
    return data.toLowerCase().trim();
  }

  applyfilters(filter) {
    this.camCardsProcessed.filter = filter;
  }

  isCustomerAdmin() {
    // TODO: !!!! IMPORTANT !!!!
    // condition should based on sth like this user.role == customer.admin
    return Math.floor(new Date().getTime() / 100) % 2;
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

  handleExpandedCamCard(camCard: CamCard) {
    const isExpanded = this.expandedCamCard && this.expandedCamCard.id === camCard.id;
    this.expandedCamCard = isExpanded ? undefined : camCard;
    if (!isExpanded) {
      this.router.navigate([], {
        relativeTo: this.activatedRoute,
        fragment: camCard.id,
      });
    }
  }

  expandCamCardByFragment() {
    this.expandedCamCard = this.camCards.find((camCard: CamCard) => camCard.id === this.fragment) || undefined;
  }

  goToExpandedCamCard() {
    if (this.fragment && this.camCardsProcessed.data.length) {
      const el = document.getElementById('camCard_' + this.fragment) as HTMLElement;
      if (el) {
        const top = el.getBoundingClientRect().top - (this.isMobileView ? 0 : 130);
        this.scroller.scrollToPosition([0, top]);
        this.expandCamCardByFragment();
      }
    }
  }

  /** addToCartItems */
  addCamCardToCart(camCard: CamCard) {
    // TODO: improve when NEW order/addToCartWay will be inProgress
    camCard.camCardItems?.map(item => {
      this.productFacade.addProductToBasket(item.product.sku, item.quantity);
    });
    camCard.subCamCards?.map(sub => {
      sub.camCardItems?.map(item => {
        this.productFacade.addProductToBasket(item.product.sku, item.quantity);
      });
    });
  }

  addSelectedItemsToCart() {
    // TODO: improve when NEW order/addToCartWay will be inProgress
    Object.values(this.productsChecked).forEach((val: ProductChecked) =>
      this.productFacade.addProductToBasket(val.sku, val.quantity)
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

  /** From emits event to move camcard. */
  move() {
    this.dialog.open(MoveCamCardDialogComponent, {
      width: '330px',
      autoFocus: false,
      data: this.checkedCamCards,
    });
  }

  /** Determine the heading of the delete modal and opens the modal. */
  openDeleteConfirmationDialog(camCard: CamCard, modal: ModalDialogComponent<string>) {
    this.translate
      .get('camfil.account.cam_cards.delete_dialog.header', { 0: camCard.name })
      .pipe(take(1), takeUntil(this.destroy$))
      .subscribe(res => (modal.options.titleText = res));

    modal.show(camCard.id);
  }

  openUserAccessDialog(camCard: CamCard): void {
    this.dialog.open(UserAccessCamCardDialogComponent, {
      width: '330px',
      autoFocus: false,
      data: { ...camCard },
    });
  }

  /** checkboxes */
  isProductChecked(id: string) {
    return this.productsChecked[id];
  }
  isCamCardChecked({ itemsCount, camCardItems, subCamCards }: CamCard) {
    const items = itemsCount > 0;
    const itemsChecked = camCardItems ? camCardItems.every(item => this.isProductChecked(item.id)) : true;
    const itemsInSubChecked = subCamCards
      ? subCamCards.every(sub =>
          sub.camCardItems ? sub.camCardItems.every(item => this.isProductChecked(item.id)) : true
        )
      : true;
    return items && itemsChecked && itemsInSubChecked;
  }
  isAllChecked() {
    return this.camCardsProcessed.data.every(camCard =>
      camCard.itemsCount > 0 ? this.isCamCardChecked(camCard) : true
    );
  }

  isCamCardIndeterminate(camCard: CamCard) {
    let itmsNum = 0;
    camCard.camCardItems?.map(({ id }) => this.isProductChecked(id) && itmsNum++);
    camCard.subCamCards?.map(sub => sub.camCardItems?.map(({ id }) => this.isProductChecked(id) && itmsNum++));
    return !this.isCamCardChecked(camCard) && itmsNum > 0;
  }
  isAllIndeterminate() {
    return Object.keys(this.productsChecked).length !== 0 && !this.isAllChecked();
  }

  handleProductCheck(item: CamCardItem, camCard: CamCard, event: MatCheckboxChange) {
    const productOnList = this.productsChecked[item.id];
    if (event.checked && !productOnList) {
      const element: ProductChecked = {
        camCardId: camCard.id,
        camCardRoot: camCard.rootCamCard,
        sku: item.product.sku,
        quantity: item.quantity,
      };
      this.productsChecked[item.id] = element;
    } else if (!event.checked && productOnList) {
      delete this.productsChecked[item.id];
    }
  }

  handleProductsCheck(camCard: CamCard, event: MatCheckboxChange) {
    camCard.camCardItems?.forEach(item => this.handleProductCheck(item, camCard, event));
    camCard.subCamCards?.forEach(subCamCard => {
      subCamCard.camCardItems?.forEach(item => this.handleProductCheck(item, camCard, event));
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

  get checkedCamCards() {
    return this.camCards ? this.camCards.filter(camCard => this.isCamCardChecked(camCard)) : [];
  }
}
