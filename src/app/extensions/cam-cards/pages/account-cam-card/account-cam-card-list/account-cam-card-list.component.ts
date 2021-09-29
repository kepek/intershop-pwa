import { animate, state, style, transition, trigger } from '@angular/animations';
import { Location, ViewportScroller } from '@angular/common';
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
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { flatten, groupBy, toArray } from 'lodash-es';
import { Observable, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import { AuthorizationToggleService } from 'ish-core/authorization-toggle.module';
import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { Address } from 'ish-core/models/address/address.model';
import { BasketView } from 'ish-core/models/basket/basket.model';
import { Bucket } from 'ish-core/models/basket/bucket.model';
import { Product } from 'ish-core/models/product/product.model';
import { DeviceType } from 'ish-core/models/viewtype/viewtype.types';
import { whenTruthy } from 'ish-core/utils/operators';
import { CamfilModalDialogComponent } from 'ish-shared/components/common/camfil-modal-dialog/camfil-modal-dialog.component';

import { CamCardsFacade } from '../../../facades/cam-cards.facade';
import { CamCardHelper } from '../../../models/cam-card/cam-card.helper';
import {
  CamCamProductChecked,
  CamCamProductsAddToCart,
  CamCard,
  CamCardCustomer,
  CamCardItem,
} from '../../../models/cam-card/cam-card.model';
import { ProductAddingErrorDialogComponent } from '../../../shared/cam-card-product-error-dialog/cam-card-product-error-dialog.component';
import { ImportCamCardDialogComponent } from '../../../shared/import-cam-card-dialog/import-cam-card-dialog.component';
import { MoveCamCardDialogComponent } from '../../../shared/move-cam-card-dialog/move-cam-card-dialog.component';
import { UserAccessCamCardDialogComponent } from '../../../shared/user-access-cam-card-dialog/user-access-cam-card-dialog.component';

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
  private static CUSTOMER_ADMIN_PERMISSIONS = ['APP_B2B_MANAGE_USERS', 'APP_B2B_PURCHASE', 'APP_B2B_MANAGE_ALL_ORDERS'];
  private static PRICE_PERMISSIONS = ['APP_B2B_VIEW_PRICES'];
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
  invalidMesurementsElements = [];
  maintenance = CamCardHelper.maintenance;
  commonShippingMethodId: string;
  basket$: Observable<BasketView>;
  buckets$: Observable<any[]>;
  buckets: Bucket[];
  basketId: string;
  basketAddresses: Address[];
  checkedCamCard = [];
  isCustomerAdmin: boolean;
  basketLoading = false;
  totalProductsInBasket: number;
  productAddingInProgress = false;
  camCardsWithNoCompleteAddresses: CamCard[];
  productsCustomerPrices: {
    [customerId: string]: Product[];
  };
  private selectedCamCardCustomer: CamCardCustomer;
  private fragment: string;
  private destroy$ = new Subject();

  constructor(
    private checkoutFacade: CheckoutFacade,
    private productFacade: ShoppingFacade,
    private camCardsFacade: CamCardsFacade,
    private changeDetectorRefs: ChangeDetectorRef,
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private scroller: ViewportScroller,
    private translate: TranslateService,
    private location: Location,
    private authorizationToggle: AuthorizationToggleService
  ) {}

  get checkedCamCards() {
    return this.camCards ? this.camCards.filter(camCard => this.isCamCardChecked(camCard)) : [];
  }

  get noErpIdCamCardsInSelectedProducts() {
    return (
      this.camCards?.filter(
        cc => !cc.erpId && Object.values(this.productsChecked)?.find((p: CamCamProductChecked) => cc.id === p.camCardId)
      ) || []
    );
  }

  ngOnInit() {
    this.isMobileView = this.isMobile();
    this.isStickyCamCardToolbar$ = this.camCardsFacade.isStickyCamCardToolbar$;

    this.activatedRoute.queryParams.pipe(take(1)).subscribe(queryParam => {
      if (queryParam.activeSort && queryParam.sortDirection && this.sort) {
        this.sort.active = queryParam.activeSort;
        this.sort.direction = queryParam.sortDirection;

        this.camCardsProcessed.sort = this.sort;
      }
    });

    this.activatedRoute.fragment.pipe(take(1)).subscribe((fragment: string) => {
      this.fragment = fragment;
      this.goToExpandedCamCard();
    });

    this.productFacade.loadBasketAddresses();
    this.basket$ = this.checkoutFacade.basket$;
    this.buckets$ = this.checkoutFacade.buckets$;

    this.basket$.pipe(whenTruthy(), takeUntil(this.destroy$)).subscribe((basket: BasketView) => {
      this.basketId = basket.id;
      this.commonShippingMethodId = basket.commonShippingMethod?.id;
    });
    this.buckets$.pipe(whenTruthy(), takeUntil(this.destroy$)).subscribe((buckets: Bucket[]) => {
      this.buckets = buckets;
    });
    this.productFacade.basketAddresses$.pipe(takeUntil(this.destroy$)).subscribe((basketAddresses: Address[]) => {
      this.basketAddresses = basketAddresses;
    });

    this.checkoutFacade.basketLoading$.pipe(takeUntil(this.destroy$)).subscribe(value => {
      this.basketLoading = value;
    });

    this.productFacade.getProductAddingError$?.pipe(whenTruthy(), takeUntil(this.destroy$)).subscribe(error => {
      if (error) {
        this.productAddingInProgress = false;
        this.changeDetectorRefs.detectChanges();
        this.productFacade.getFailedCamCardName$.pipe(whenTruthy(), take(1)).subscribe(failedName => {
          this.showErrorModal(error, failedName);
        });
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.camCards) {
      if (this.camCards?.length) {
        this.authorizationToggle
          .isAuthorizedToCheckArrAll(AccountCamCardListComponent.CUSTOMER_ADMIN_PERMISSIONS)
          .pipe(take(1))
          .subscribe(p => {
            this.isCustomerAdmin = p;

            if (this.isCustomerAdmin && !this.columnsToDisplay.includes('userAccess')) {
              this.columnsToDisplay.splice(6, 0, 'userAccess');
            }
            const realCamCards = CamCardHelper.getRealCamCards(this.camCards);
            const camCardsToFilter = this.addCustomerNoToData(realCamCards);

            this.camCardsProcessed = new MatTableDataSource(camCardsToFilter);

            this.changeDetectorRefs.detectChanges();

            this.camCardsProcessed.filterPredicate = (data, filter) => {
              const filtered = this.simplifyData(filter);
              const additionalFields = data.camCardItems.reduce((arr, item) => {
                const label = item.comment?.label;
                if (label) {
                  arr.push(label);
                }
                return arr;
              }, []);
              data.subCamCards.reduce((res, el) => {
                res.push(el.name);
                el.camCardItems.forEach(item => (item.comment?.label ? res.push(item.comment.label) : ''));
                return res;
              }, additionalFields);
              return (
                (this.simplifyData(data.customer.companyName).indexOf(filtered) !== -1 ||
                  this.simplifyData(data.customer.customerNo).indexOf(filtered) !== -1 ||
                  this.simplifyData(data.name).indexOf(filtered) !== -1 ||
                  !!additionalFields.filter(item => this.simplifyData(item).indexOf(filtered) !== -1).length) &&
                this.simplifyData(this.selectedCamCardCustomer?.customerNo || data?.customer?.customerNo) ===
                  this.simplifyData(data?.customer?.customerNo)
              );
            };

            this.camCardsProcessed.sortingDataAccessor = (item, property) =>
              property === 'customer'
                ? item.customer.companyName
                : property === 'name'
                ? item[property].toLocaleLowerCase()
                : item[property];
            this.camCardsProcessed.sort = this.sort;
            if (this.camCardsProcessed.sort) {
              this.camCardsProcessed.sort.disableClear = true;
            }
            this.goToExpandedCamCard();
            this.loading = this.camCardLoading;
          });

        this.loadCustomerPrices();
      } else {
        this.loading = this.camCardLoading;
      }
    }
    this.isMobileView = this.isMobile();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadCustomerPrices() {
    this.authorizationToggle
      .isAuthorizedToCheckArrAll(AccountCamCardListComponent.PRICE_PERMISSIONS)
      .pipe(take(1))
      .subscribe(permitted => {
        if (permitted && !this.productsCustomerPrices) {
          this.productsCustomerPrices = {};
          const customersAndSkus = this.camCards.reduce((acc, cc) => {
            const skus = CamCardHelper.getCamCardSkus(cc);
            const currentSkus = acc?.[cc.customer.id] || [];

            return {
              ...acc,
              [cc.customer.id]: [...new Set([...currentSkus, ...skus])],
            };
          }, {}) as { key: string[] };

          Object.entries(customersAndSkus).forEach(([customerId, skus]) => {
            const { parent } = this.camCards.find(cc => cc.customer.id === customerId).customer;
            if (!parent) {
              this.productFacade.loadCustomerPrices(customerId, skus);
              this.productFacade
                .getCustomerPrices$(customerId)
                .pipe(whenTruthy(), take(1))
                .subscribe(prices => {
                  this.productsCustomerPrices[customerId] = prices;
                });
            }
          });
        }
      });
  }

  getCustomerPriceForSkuInCustomer(id: string, sku: string) {
    const item = this.productsCustomerPrices?.[id]?.find(prod => prod.sku === sku);
    return { listPrice: item?.listPrice, salePrice: item?.salePrice };
  }

  simplifyData(data) {
    return data?.toLowerCase()?.trim();
  }

  addCustomerNoToData(realCamCards) {
    return realCamCards?.map(rc => ({
      ...rc,
      customerNo: rc.customer.customerNo,
    }));
  }

  applyFilters(filterObject: { query: string; customer?: CamCardCustomer }) {
    if (!filterObject) {
      return;
    }

    const { query, customer } = filterObject;

    this.selectedCamCardCustomer = customer;
    this.camCardsProcessed.filter = query || customer?.customerNo;
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

  handleExpandedCamCard(camCard: CamCard, rowId) {
    const isExpanded = this.expandedCamCard && this.expandedCamCard.id === camCard.id;
    this.expandedCamCard = isExpanded ? undefined : camCard;
    setTimeout(() => {
      this.scrollToSelectedRow(rowId);
      if (!isExpanded) {
        this.location.replaceState(this.location.path(false) + '#' + camCard.id);
        this.openSubLevels(camCard);
      } else {
        this.location.replaceState(this.location.path(false));
      }
    });
  }

  isCamCardExpanded(cc: CamCard) {
    return cc.id === this.expandedCamCard?.id;
  }

  openSubLevels(camCard: CamCard) {
    camCard.subCamCards.forEach(sub => {
      if (!this.isSubOpen.includes(sub.id)) {
        this.isSubOpen.push(sub.id);
      }
    });
  }

  expandCamCardByFragment() {
    this.expandedCamCard = this.camCards.find((camCard: CamCard) => camCard.id === this.fragment) || undefined;
    if (this.expandedCamCard) {
      this.openSubLevels(this.expandedCamCard);
    }
  }

  goToExpandedCamCard() {
    if (this.fragment && this.camCardsProcessed?.data.length) {
      const el = document.getElementById('camCard_' + this.fragment) as HTMLElement;
      if (el) {
        const top = el.getBoundingClientRect().top - (this.isMobileView ? 0 : 130);
        this.scroller.scrollToPosition([0, top]);
        this.expandCamCardByFragment();
      }
    }
  }

  scrollToSelectedRow(rowId) {
    const rowEl = document.getElementById('camCard_' + rowId) as HTMLElement;
    const top = rowEl.getBoundingClientRect().top + window.scrollY - 132;
    window.scrollTo({ top, behavior: 'auto' });
  }

  /** addToCartItems */
  addToCart(modal: CamfilModalDialogComponent<any>) {
    const incorrectElemetns = {
      notBuyableElemnts: this.getIncorrectCamCardsElements('inactive'),
      invalidMesurementsElements: this.getIncorrectCamCardsElements('measurements'),
    };

    const noEroId = this.noErpIdCamCardsInSelectedProducts;

    if (
      noEroId.length ||
      incorrectElemetns.notBuyableElemnts.length ||
      incorrectElemetns.invalidMesurementsElements.length
    ) {
      this.notBuyableElemnts = incorrectElemetns.notBuyableElemnts;
      this.invalidMesurementsElements = incorrectElemetns.invalidMesurementsElements;
      this.notAvailbaleProdList(modal);
    } else {
      this.addSelectedItemsToCart();
    }
  }

  addSelectedItemsToCart() {
    const list = Object.values(this.productsChecked)
      .filter((item: CamCamProductChecked) => item.measurement.valid && item.camCardErpId)
      .reduce((acc, val: CamCamProductChecked) => {
        const key = val.camCardRoot || val.camCardId;
        const products = acc[key]?.products || [];

        acc[key] = {
          products: [...products, val],
        };
        return acc;
      }, {}) as CamCamProductsAddToCart;

    if (!Object.keys(list).length) {
      return;
    }
    this.camCardsWithNoCompleteAddresses = this.camCards.filter(({ deliveryAddress, id }) => {
      const { postalCode, city, addressLine1 } = deliveryAddress;
      // + add filter by checked CC
      return list[id] && (!postalCode || !city || !addressLine1);
    });

    for (const property in list) {
      if (list.hasOwnProperty(property)) {
        list[property].allProductsSelected = this.checkIfAllProductsSelected(property, list[property].products);
      }
    }

    CamCardHelper.addToCartFromCamCards(
      this.camCardsFacade,
      this.productFacade,
      list,
      this.camCards,
      this.commonShippingMethodId,
      this.basketId
    );

    const event = { checked: false };
    this.productAddingInProgress = true;
    this.productFacade.productAdded$.pipe(whenTruthy(), take(1)).subscribe(val => {
      if (val) {
        this.masterToggle(event as MatCheckboxChange);
        this.productAddingInProgress = false;
        this.changeDetectorRefs.detectChanges();
      }
    });
  }

  notAvailbaleProdList(modal: CamfilModalDialogComponent<any>) {
    modal.show();
  }

  invalidMeasurementsProdList(modal: CamfilModalDialogComponent<any>) {
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
    const name = this.translate.instant('camfil.account.cam_card.name.copy_prefix') + this.checkedCamCards[0].name;
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
  handleShowCheckbox(camCard: CamCard) {
    return camCard.itemsCount > 0 && !this.maintenance(camCard, ['INACTIVE']);
  }

  getIncorrectCamCardsElements(type) {
    return (
      this.camCardsProcessed.data
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
          const allInvalidElements =
            type === 'inactive'
              ? this.getInactiveProductsInCamCard(cc)
              : this.getInvalidMeasurementsProductsInCamCard(cc);

          // clean up duplicate products
          const items = allInvalidElements.filter(
            (item, i, arr) => arr.findIndex(el => el.product.sku === item.product.sku) === i
          );

          return { name: cc.name, isChild: !!cc.rootCamCard, items };
        })
        // remove empty camCards (without not available items)
        .filter(item => item.items.length)
    );
  }

  getInactiveProducts(items: CamCardItem[]) {
    return items?.filter(el => !el.product.available) || [];
  }

  getInactiveProductsInCamCard(camCard: CamCard) {
    const inactive = this.getInactiveProducts(camCard.camCardItems);
    return camCard.subCamCards?.reduce((arr, sub) => {
      const sumItem = this.getInactiveProducts(sub.camCardItems);
      return sumItem.length ? [...arr, ...sumItem] : arr;
    }, inactive);
  }

  getInvalidMeasurements(items: CamCardItem[]) {
    return items?.filter(el => !el.measurement.valid) || [];
  }

  getInvalidMeasurementsProductsInCamCard(camCard: CamCard) {
    const invalidMeasurements = this.getInvalidMeasurements(camCard.camCardItems);
    return camCard.subCamCards?.reduce((arr, sub) => {
      const sumItem = this.getInvalidMeasurements(sub.camCardItems);
      return sumItem.length ? [...arr, ...sumItem] : arr;
    }, invalidMeasurements);
  }

  isProductChecked(id: string) {
    return this.productsChecked[id];
  }

  isCamCardChecked(camCard: CamCard) {
    const { itemsCount, camCardItems, subCamCards, id } = camCard;
    const notAvailableProducts = this.getInactiveProductsInCamCard(camCard)?.length;
    const items = itemsCount > 0 && notAvailableProducts !== itemsCount;
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

    return itemsCount > notAvailableProducts ? items && itemsChecked && itemsInSubChecked : this.isOnCheckedList(id);
  }

  isOnCheckedList(id: string) {
    return this.checkedCamCard.findIndex(item => item === id) > -1;
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
      const element: CamCamProductChecked = {
        camCardId: camCard.id,
        camCardErpId: !!camCard.erpId,
        camCardRoot: camCard.rootCamCard,
        sku: item.product.sku,
        quantity: item.quantity,
        boxLabel: CamCardHelper.handleBoxLabelToOrderItem(camCard, item),
        measurement: item.measurement,
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
    this.camCardsProcessed.filteredData.forEach(row => {
      this.handleProductsCheck(row, event);
    });

    this.checkedCamCard = event.checked ? this.camCardsProcessed.filteredData.map(cc => cc.id) : [];
  }

  camCardToggle(camCard: CamCard, event: MatCheckboxChange) {
    this.handleProductsCheck(camCard, event);

    if (event.checked) {
      this.checkedCamCard.push(camCard.id);
    } else {
      this.checkedCamCard = this.checkedCamCard.filter(el => el !== camCard.id);
    }
  }

  handleProductCheckbox(item: CamCardItem, camCard: CamCard, event: MatCheckboxChange) {
    this.handleProductCheck(item, camCard, event);
  }

  // Emit camcard import
  importCamCard() {
    this.dialog.open(ImportCamCardDialogComponent, {
      width: '600px',
      autoFocus: false,
    });
  }

  /**
   *
   * Check if all AVAILABLE product from CamCard are selected
   *
   **/
  checkIfAllProductsSelected(camCardId: string, products: CamCamProductChecked[]) {
    const camCard = this.camCards.find(c => c.id === camCardId);
    const allIds = CamCardHelper.getCamCardItemsIds(camCard, true);
    return allIds.length === products?.length;
  }

  sortData(event) {
    if (event.active !== 'name') {
      // Divide array to arrays based on value of active sort
      const groupedArrays = groupBy(this.camCardsProcessed.filteredData, event.active);
      // Sort each property in object by name - Ascending
      for (const property in groupedArrays) {
        if (groupedArrays.hasOwnProperty(property)) {
          groupedArrays[property].sort((x, y) =>
            x.name.toLowerCase() > y.name.toLowerCase() ? 1 : y.name.toLowerCase() > x.name.toLowerCase() ? -1 : 0
          );
        }
      }

      // Join results into one array
      const newGroup = flatten(toArray(groupedArrays)?.sort((a, b) => a[0][event.active] - b[0][event.active]));
      this.camCardsProcessed.data = newGroup;
    }
  }

  setSortParam() {
    return {
      activeSort: this.sort?.active,
      sortDirection: this.sort?.direction,
    };
  }

  showErrorModal(error, camCardName: string): void {
    this.dialog.open(ProductAddingErrorDialogComponent, {
      width: '330px',
      autoFocus: false,
      data: { errorMessage: error.message, camCardName },
    });
  }
}
