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
import { take } from 'rxjs/operators';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { DeviceType } from 'ish-core/models/viewtype/viewtype.types';
import { CamfilModalDialogComponent } from 'ish-shared/components/common/camfil-modal-dialog/camfil-modal-dialog.component';

import { CamCardsFacade } from '../../../facades/cam-cards.facade';
import { CamCardHelper } from '../../../models/cam-card/cam-card.helper';
import { CamCard, CamCardItem } from '../../../models/cam-card/cam-card.model';
import { MoveCamCardDialogComponent } from '../../../shared/move-cam-card-dialog/move-cam-card-dialog.component';
import { UserAccessCamCardDialogComponent } from '../../../shared/user-access-cam-card-dialog/user-access-cam-card-dialog.component';

export interface ProductChecked {
  camCardId: string;
  camCardRoot: string;
  urn: string;
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
  @Input() camCardLoading: boolean;
  @Output() addCamCard = new EventEmitter<CamCard>();
  @ViewChild(MatSort) sort: MatSort;

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
  notBuyableElemnts = [];
  maintenance = CamCardHelper.maintenance;
  private fragment: string;

  private destroy$ = new Subject();

  constructor(
    private productFacade: ShoppingFacade,
    private camCardsFacade: CamCardsFacade,
    private changeDetectorRefs: ChangeDetectorRef,
    public dialog: MatDialog,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private scroller: ViewportScroller,
    private translate: TranslateService
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
      const realCamCards = CamCardHelper.getRealCamCards(this.camCards);
      this.camCardsProcessed = new MatTableDataSource(realCamCards);
      this.changeDetectorRefs.detectChanges();

      this.camCardsProcessed.filterPredicate = (data, filter) => {
        const filtered = this.simplifyData(filter);
        const additionalFields = data.camCardItems.map(item => item.comment.label);
        data.subCamCards.reduce((res, el) => {
          res.push(el.name);
          el.camCardItems.forEach(item => {
            res.push(item.comment.label);
          });
          return res;
        }, additionalFields);
        return (
          this.simplifyData(data.customer.companyName).indexOf(filtered) !== -1 ||
          this.simplifyData(data.name).indexOf(filtered) !== -1 ||
          !!additionalFields.filter(item => this.simplifyData(item).indexOf(filtered) !== -1).length
        );
      };
      this.camCardsProcessed.sort = this.sort;
      this.camCardsProcessed.sortingDataAccessor = (item, property) =>
        property === 'customer' ? item.customer.companyName : item[property];

      this.goToExpandedCamCard();
      this.loading = this.camCardLoading;
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
  addToCart(modal: CamfilModalDialogComponent<any>) {
    const notBuyableElemnts = this.camCardsProcessed.data
      // Checked CamCards
      .reduce((output, camcard) => {
        if (this.isCamCardChecked(camcard)) {
          output.push(camcard);
        } else {
          const checkedSubs = camcard.subCamCards.filter(sub => this.isCamCardChecked(sub));
          if (checkedSubs.length) {
            output.push(checkedSubs);
          }
        }
        return output;
      }, [])
      // mapping checked CamCards for view
      .map((cc: CamCard) => {
        const allNotAvailableItems = cc.camCardItems?.filter(item => !item.product.available) || [];
        cc.subCamCards?.forEach(({ camCardItems }) => {
          camCardItems.forEach(item => {
            if (!item.product.available) {
              allNotAvailableItems.push(item);
            }
          });
        });
        // clean up duplicate products
        const items = allNotAvailableItems.filter(
          (item, i, arr) => arr.findIndex(el => el.product.sku === item.product.sku) === i
        );
        return { name: cc.name, isChild: !!cc.rootCamCard, items };
      })
      // remove empty camCards (without not available items)
      .filter(item => item.items.length);

    if (notBuyableElemnts.length) {
      this.notBuyableElemnts = notBuyableElemnts;
      this.notAvailbaleProdList(modal);
    } else {
      this.addSelectedItemsToCart();
    }
  }

  addSelectedItemsToCart() {
    Object.values(this.productsChecked).forEach((val: ProductChecked) =>
      this.productFacade.addProductToBasket(val.sku, val.quantity, val.urn)
    );
  }

  notAvailbaleProdList(modal: CamfilModalDialogComponent<any>) {
    modal.show();
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

  copyCamCard() {
    this.loading = true;
    const name = this.translate.instant('camfil.account.cam_cards.name.copy_prefix') + this.checkedCamCards[0].name;
    this.camCardsFacade.copyCamCard(this.checkedCamCards[0].id, name);
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
    const itemsChecked = camCardItems
      ? camCardItems.filter(item => item.product.available).every(item => this.isProductChecked(item.id))
      : true;
    const itemsInSubChecked = subCamCards
      ? subCamCards.every(sub =>
          sub.camCardItems
            ? sub.camCardItems.filter(item => item.product.available).every(item => this.isProductChecked(item.id))
            : true
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
    if (event.checked && !productOnList && item.product.available) {
      const element: ProductChecked = {
        camCardId: camCard.id,
        camCardRoot: camCard.rootCamCard,
        urn: this.getCamCardUrn(camCard.rootCamCard) || camCard.deliveryAddress.urn,
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

  getCamCardUrn(id: string) {
    const cc = this.camCards.find(item => item.id === id);
    return cc?.deliveryAddress.urn || '';
  }

  get checkedCamCards() {
    return this.camCards ? this.camCards.filter(camCard => this.isCamCardChecked(camCard)) : [];
  }
}
