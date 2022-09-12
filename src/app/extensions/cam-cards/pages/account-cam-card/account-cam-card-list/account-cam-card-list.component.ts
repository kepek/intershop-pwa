import { animate, state, style, transition, trigger } from '@angular/animations';
import { Location, ViewportScroller } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CamfilConfigurationFacade } from 'camfil-pwa/facades/camfil-configuration.facade';
import { flatten, groupBy, toArray } from 'lodash-es';
import { Observable, ReplaySubject, Subject, combineLatest } from 'rxjs';
import { distinctUntilChanged, filter, map, startWith, take, takeUntil, tap } from 'rxjs/operators';

import { AuthorizationToggleService } from 'ish-core/authorization-toggle.module';
import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { Address } from 'ish-core/models/address/address.model';
import { BasketView } from 'ish-core/models/basket/basket.model';
import { Bucket } from 'ish-core/models/bucket/bucket.model';
import { Product } from 'ish-core/models/product/product.model';
import { DeviceType } from 'ish-core/models/viewtype/viewtype.types';
import { whenFalsy, whenTruthy } from 'ish-core/utils/operators';
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

const ANIMATION_TIMEOUT = 225;

@Component({
  selector: 'camfil-account-cam-card-list',
  templateUrl: './account-cam-card-list.component.html',
  styleUrls: ['./account-cam-card-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', opacity: '0' })),
      state('expanded', style({ height: 'auto', opacity: '1' })),
      transition('expanded <=> collapsed', animate(`${ANIMATION_TIMEOUT}ms cubic-bezier(0.4, 0.0, 0.2, 1)`)),
    ]),
  ],
})
export class AccountCamCardListComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
  constructor(
    private checkoutFacade: CheckoutFacade,
    private shoppingFacade: ShoppingFacade,
    private camCardsFacade: CamCardsFacade,
    private changeDetectorRefs: ChangeDetectorRef,
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private viewportScroller: ViewportScroller,
    private translate: TranslateService,
    private location: Location,
    private authorizationToggle: AuthorizationToggleService,
    private camfilConfigurationFacade: CamfilConfigurationFacade
  ) {}

  get checkedCamCards(): CamCard[] {
    return this.camCards ? this.camCards.filter(camCard => this.isCamCardChecked(camCard)) : [];
  }

  get noErpIdCamCardsInSelectedProducts() {
    return (
      this.camCards?.filter(
        cc => !cc.erpId && Object.values(this.productsChecked)?.find((p: CamCamProductChecked) => cc.id === p.camCardId)
      ) || []
    );
  }

  get noPostCodeCamCardsInSelectedProducts() {
    return (
      this.camCards?.filter(
        cc =>
          (!cc.deliveryAddress.postalCode || !cc.deliveryAddress.city) &&
          Object.values(this.productsChecked)?.find((p: CamCamProductChecked) => cc.id === p.camCardId)
      ) || []
    );
  }

  get realCamCards(): CamCard[] {
    return CamCardHelper.getRealCamCards(this.camCards)?.map(rc => ({
      ...rc,
      customerNo: rc.customer.customerNo,
    }));
  }

  get sortQueryParams() {
    return {
      activeSort: this.sort?.active,
      sortDirection: this.sort?.direction,
    };
  }

  get camCards() {
    return this.camCardsValue;
  }

  @Input() set camCards(camCards: CamCard[]) {
    this.camCardsValue = camCards;
    this.camCards$.next(camCards);
  }
  private get expandedCamCardId() {
    return this.expandedCamCardValue;
  }

  private set expandedCamCardId(camCardId: string) {
    this.expandedCamCardValue = camCardId;
    this.expandedCamCardId$.next(camCardId);
  }
  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.sort = ms;
    this.dataSource.sort = ms;
  }
  private static CUSTOMER_ADMIN_PERMISSIONS = ['APP_B2B_MANAGE_USERS', 'APP_B2B_PURCHASE', 'APP_B2B_MANAGE_ALL_ORDERS'];
  private static PRICE_PERMISSIONS = ['APP_B2B_VIEW_PRICES'];

  private loadedCamCardDetailsIds: string[] = [];
  private stickyCamCardToolbarHeight: [number, number] | (() => [number, number]) = [0, 110];

  @Input() deviceType: DeviceType;
  @Input() camCardLoading: boolean;

  @Output() addCamCard = new EventEmitter<CamCard>();

  @ViewChild(MatSort) sort: MatSort;

  addToCartProcess: boolean;
  basket$: Observable<BasketView>;
  basketAddresses: Address[];
  basketId: string;
  basketLoading = false;
  basketLoading$: Observable<boolean>;
  buckets$: Observable<Bucket[]>;
  buckets: Bucket[];
  camCards$ = new ReplaySubject<CamCard[]>(1);
  camCardsInBasketsForAllUsers: string[];
  camCardsInBasketsForAllUsersLoading$: Observable<boolean>;
  checkedCamCard = [];
  columnsToDisplay$: Observable<string[]>;
  commonShippingMethodId: string;
  dataSource = new MatTableDataSource<CamCard>();
  expandedCamCardId$ = new ReplaySubject<string>(1);
  freshErpInfo = false;
  isCustomerAdmin: boolean;
  isMobileView = false;
  isStickyCamCardToolbar$: Observable<boolean>;
  itemSize = 80;
  loading = true;
  maintenance = CamCardHelper.maintenance;
  notBuyableElemnts = [];
  numberOfVisibleLineItems = 10;
  preventCamCardERPIdValidation = false;
  productAddingInProgress = false;
  productsChecked = {};
  productsCustomerPrices: {
    [customerId: string]: Product[];
  };
  private isSubOpen = [];
  private camCardsValue: CamCard[] = [];
  private destroy$ = new Subject();
  private expandedCamCardValue: string;
  private selectedCamCardCustomer: CamCardCustomer;

  private initColumnsToDisplay() {
    this.columnsToDisplay$ = this.authorizationToggle
      .isAuthorizedToCheckArrAll(AccountCamCardListComponent.CUSTOMER_ADMIN_PERMISSIONS)
      .pipe(
        startWith([]),
        map(isAuthorized => {
          const columnsToDisplay = {
            name: true,
            customer: true,
            lastDeliveryDate: true,
            deliveryInterval: true,
            nextDeliveryDate: true,
            itemsCount: true,
            edit: true,
            userAccess: false,
            checkbox: true,
          };

          if (isAuthorized) {
            columnsToDisplay.userAccess = true;
          }

          return Object.entries(columnsToDisplay)
            .filter(([, value]) => value)
            .map(([key]) => key);
        })
      );
  }

  private initDataSource() {
    this.dataSource.data = this.realCamCards;

    this.dataSource.sort = this.sort;

    this.dataSource.filterPredicate = (data, filterString) => {
      const filtered = this.simplifyData(filterString);
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

    this.dataSource.sortingDataAccessor = (item, property) =>
      property === 'customer'
        ? item.customer.companyName
        : property === 'name'
        ? item[property].toLocaleLowerCase()
        : item[property];

    if (this.dataSource.sort) {
      this.dataSource.sort.disableClear = true;
    }
  }

  private initDataSourceSortQueryParamsObserver() {
    this.activatedRoute.queryParams.pipe(whenTruthy()).subscribe(queryParam => {
      if (queryParam.activeSort && queryParam.sortDirection && this.sort) {
        this.sort.active = queryParam.activeSort;
        this.sort.direction = queryParam.sortDirection;
        this.dataSource.sort = this.sort;
      }
    });
  }

  private initRouteFragmentObserver() {
    combineLatest([this.activatedRoute.fragment, this.camCards$])
      .pipe(
        filter(([camCardId, camCards]) => !!camCardId && !!camCards?.length),
        takeUntil(this.destroy$)
      )
      .subscribe(([camCardId, camCards]) => {
        const camCard = camCards.find(cc => cc.id === camCardId);
        this.toggleCamCard(camCard);
      });
  }

  ngOnInit() {
    this.initColumnsToDisplay();
    this.initDataSource();

    this.viewportScroller.setHistoryScrollRestoration('manual');

    this.isStickyCamCardToolbar$ = this.camCardsFacade.isStickyCamCardToolbar$;
    this.basket$ = this.checkoutFacade.basket$;
    this.buckets$ = this.checkoutFacade.buckets$;
    this.camCardsInBasketsForAllUsersLoading$ = this.camCardsFacade.getCamCardsInBasketsForAllUsersLoading$;

    this.basket$.pipe(whenTruthy(), takeUntil(this.destroy$)).subscribe((basket: BasketView) => {
      this.basketId = basket.id;
      this.commonShippingMethodId = basket.commonShippingMethod?.id;
    });

    this.buckets$.pipe(whenTruthy(), takeUntil(this.destroy$)).subscribe((buckets: Bucket[]) => {
      this.buckets = buckets;
    });

    this.checkoutFacade.basketLoading$.pipe(takeUntil(this.destroy$)).subscribe(value => {
      this.basketLoading = value;
    });

    this.camCardsFacade.getCamCardsInBasketsForAllUsers$.pipe(takeUntil(this.destroy$)).subscribe(list => {
      this.camCardsInBasketsForAllUsers = list;
    });

    this.shoppingFacade.getProductAddingError$?.pipe(whenTruthy(), takeUntil(this.destroy$)).subscribe(error => {
      if (error) {
        this.productAddingInProgress = false;
        this.changeDetectorRefs.detectChanges();
        this.shoppingFacade.getFailedCamCardName$.pipe(whenTruthy(), take(1)).subscribe(failedName => {
          this.showErrorModal(error, failedName);
        });
      }
    });

    this.camfilConfigurationFacade
      .isEnabled$('preventCamCardERPIdValidation')
      ?.pipe(takeUntil(this.destroy$))
      .subscribe(val => {
        this.preventCamCardERPIdValidation = val;
      });

    this.camCardsFacade.camCardAdding$.pipe(takeUntil(this.destroy$)).subscribe(value => {
      this.productAddingInProgress = value;
    });

    this.initRouteFragmentObserver();
  }

  ngAfterViewInit() {
    this.initDataSourceSortQueryParamsObserver();
  }

  ngOnChanges() {
    this.dataSource.data = this.realCamCards;
    this.isMobileView = this.isMobile();
    this.loading = this.camCardLoading;
    this.viewportScroller.setOffset(this.isMobileView ? [0, 0] : this.stickyCamCardToolbarHeight);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadProducts(cc: CamCard) {
    const skus = CamCardHelper.getCamCardSkus(cc);
    return this.shoppingFacade.products$(skus);
  }

  private loadCustomerPrices() {
    if (!this.productsCustomerPrices && this.camCards.length) {
      this.productsCustomerPrices = {};
      this.authorizationToggle
        .isAuthorizedToCheckArrAll(AccountCamCardListComponent.PRICE_PERMISSIONS)
        .pipe(whenTruthy(), take(1))
        .subscribe(() => {
          const customersAndSkus = this.camCards.reduce((acc, cc) => {
            const skus = CamCardHelper.getCamCardSkus(cc);
            const currentSkus = acc?.[cc.customer.id] || [];

            return {
              ...acc,
              [cc.customer.id]: [...new Set([...currentSkus, ...skus])],
            };
          }, {}) as { key: string[] };

          Object.entries(customersAndSkus).forEach(([customerId, skus]) => {
            this.shoppingFacade.loadCustomerPrices(customerId, skus);
            this.shoppingFacade
              .getCustomerPrices$(customerId)
              .pipe(whenTruthy(), take(1))
              .subscribe(prices => {
                this.productsCustomerPrices[customerId] = prices;
                this.changeDetectorRefs.markForCheck();
              });
          });
        });
    }
  }

  getCustomerPriceForSkuInCustomer(id: string, sku: string) {
    const item = this.productsCustomerPrices?.[id]?.find(prod => prod.sku === sku);
    return { listPrice: item?.listPrice, salePrice: item?.salePrice };
  }

  private simplifyData(data) {
    return data?.toLowerCase()?.trim();
  }

  applyFilters(filterObject: { query: string; customer?: CamCardCustomer }) {
    if (!filterObject) {
      return;
    }

    const { query, customer } = filterObject;

    this.selectedCamCardCustomer = customer;
    this.dataSource.filter = query || customer?.customerNo;
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

  protected loadCamCardDetails(camCard) {
    return this.loadProducts(camCard).pipe(
      filter(products => products?.length === CamCardHelper.getCamCardSkus(camCard).length),
      distinctUntilChanged((x, y) => x.length === y.length),
      take(1),
      tap(() => {
        this.loadCustomerPrices();
      })
    );
  }

  toggleCamCard(camCard: CamCard) {
    this.toggleCamCardHandler(camCard);
  }

  private toggleCamCardHandler(camCard: CamCard) {
    const isExpanded = !!(this.expandedCamCardId === camCard.id);
    const locationPath = this.location.path(false);

    if (!isExpanded) {
      this.location.replaceState(`${locationPath}#${camCard.id}`);
      this.openSubLevels(camCard);
    } else {
      this.location.replaceState(`${locationPath}`);
    }

    this.expandedCamCardId = isExpanded ? undefined : camCard.id;
  }

  isCamCardDetailsLoaded(camCard: CamCard) {
    return !!this.loadedCamCardDetailsIds.find(id => id === camCard.id);
  }

  isCamCardExpanded(cc: CamCard) {
    return cc.id === this.expandedCamCardId;
  }

  openSubLevels(camCard: CamCard) {
    camCard.subCamCards.forEach(sub => {
      if (!this.isSubOpen.includes(sub.id)) {
        this.isSubOpen.push(sub.id);
      }
    });
  }

  /** addToCartItems */
  handleSelectedCamCardsOnAddToCart(
    // tslint:disable-next-line:variable-name
    checkInBasketModal: CamfilModalDialogComponent<unknown>,
    addToCartFlowModal: CamfilModalDialogComponent<unknown>
  ) {
    const noErpIds = this.preventCamCardERPIdValidation ? [] : this.noErpIdCamCardsInSelectedProducts;
    const noPostCode = this.noPostCodeCamCardsInSelectedProducts;

    if (noErpIds.length && !this.freshErpInfo) {
      this.productAddingInProgress = true;
      this.camCardsFacade.loadCamCards(false);
      this.camCardsFacade.camCardsLoading$.pipe(whenFalsy(), take(1)).subscribe(() => {
        this.freshErpInfo = true;
        this.handleSelectedCamCardsOnAddToCart(checkInBasketModal, addToCartFlowModal);
      });
      return;
    }
    this.productAddingInProgress = false;
    this.freshErpInfo = false;

    if (noErpIds.length || noPostCode.length) {
      addToCartFlowModal.show();
      return;
    }

    const ids = this.checkedCamCards.map(cc => cc.id);
    this.camCardsFacade.checkCamCardsInBasketsForAllUsers(ids);
    this.camCardsInBasketsForAllUsersLoading$.pipe(whenFalsy(), take(1)).subscribe(() => {
      if (this.camCardsInBasketsForAllUsers?.length && checkInBasketModal?.show) {
        checkInBasketModal.show();
      } else {
        this.addToCart(addToCartFlowModal);
      }
    });
  }

  addToCart(modal: CamfilModalDialogComponent<unknown>) {
    const { notBuyableElemnts } = {
      notBuyableElemnts: this.getIncorrectCamCardsElements(),
    };

    if (notBuyableElemnts.length) {
      this.notBuyableElemnts = notBuyableElemnts;

      modal.show();
    } else {
      this.addSelectedItemsToCart();
    }
  }

  addSelectedItemsToCart() {
    this.addToCartProcess = true;
    const list = Object.values(this.productsChecked).reduce((acc, val: CamCamProductChecked) => {
      const key = val.camCardRoot || val.camCardId;
      const products = acc[key]?.products || [];

      acc[key] = {
        products: [...products, val],
      };
      return acc;
    }, {}) as CamCamProductsAddToCart;

    if (!Object.keys(list).length) {
      this.productAddingInProgress = false;
      this.addToCartProcess = false;
      return;
    }

    for (const ccId in list) {
      if (list.hasOwnProperty(ccId)) {
        list[ccId].allProductsSelected = this.checkIfAllProductsSelected(ccId, list[ccId].products);
      }
    }

    CamCardHelper.addToCartFromCamCards(
      this.camCardsFacade,
      this.shoppingFacade,
      list,
      this.camCards,
      this.commonShippingMethodId,
      this.basketId
    );

    const event = { checked: false };
    this.productAddingInProgress = true;
    this.shoppingFacade.productAdded$.pipe(whenTruthy(), take(1)).subscribe(val => {
      if (val) {
        this.masterToggle(event as MatCheckboxChange);
        this.productAddingInProgress = false;
        this.addToCartProcess = false;
        this.changeDetectorRefs.detectChanges();
      }
    });
  }

  addSelectedAndFilteredItemsToCart(modal: CamfilModalDialogComponent<unknown>) {
    if (!this.addToCartProcess) {
      // tslint:disable-next-line: ish-no-object-literal-type-assertion
      const event = { checked: false } as MatCheckboxChange;
      this.camCardsInBasketsForAllUsers.forEach(id => {
        const camCard = this.camCards.find(cc => cc.id === id);
        this.camCardToggle(camCard, event);
      });
    }

    this.addToCart(modal);
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

  getIncorrectCamCardsElements() {
    return (
      this.dataSource.data
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
          // clean up duplicate products
          const items = this.getInvalidProductsInCamCard(cc) || [];
          items.filter((item, i, arr) => arr.findIndex(el => el.product.sku === item.product.sku) === i);

          return { name: cc.name, isChild: !!cc.rootCamCard, items };
        })
        // remove empty camCards (without not available items)
        .filter(item => item.items.length)
    );
  }

  getInvalidProductsInCamCard(camCard: CamCard): CamCardItem[] {
    const invalidItems = CamCardHelper.getInvalidItems(camCard.camCardItems);
    return camCard.subCamCards?.reduce((arr, sub) => {
      const sumItem = CamCardHelper.getInvalidItems(sub.camCardItems);
      return sumItem.length ? [...arr, ...sumItem] : arr;
    }, invalidItems);
  }

  getCamCardNameById(id: string) {
    return this.camCards?.find(cc => cc.id === id)?.name || '';
  }

  isProductChecked(id: string) {
    return this.productsChecked[id];
  }

  isCamCardChecked(camCard: CamCard) {
    const { itemsCount, camCardItems, subCamCards, id } = camCard;
    const notAvailableProducts = this.getInvalidProductsInCamCard(camCard)?.length;
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
    return this.dataSource.data.every(camCard => (camCard.itemsCount > 0 ? this.isCamCardChecked(camCard) : true));
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
        sourceCCLineItemId: item.id,
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
    this.dataSource.filteredData.forEach(row => {
      this.handleProductsCheck(row, event);
    });

    this.checkedCamCard = event.checked ? this.dataSource.filteredData.map(cc => cc.id) : [];
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

  importCamCard() {
    this.dialog.open(ImportCamCardDialogComponent, {
      width: '600px',
      autoFocus: false,
    });
  }

  /**
   *
   * Check if all AVAILABLE and measurement.valid products from CamCard are selected
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
      const groupedArrays = groupBy(this.dataSource.filteredData, event.active);
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
      this.dataSource.data = newGroup;
    }
  }

  showErrorModal(error, camCardName: string): void {
    this.dialog.open(ProductAddingErrorDialogComponent, {
      width: '330px',
      autoFocus: false,
      data: { errorMessage: error.message, camCardName },
    });
  }

  showAllCustomerCamCards(event: MatCheckboxChange) {
    this.loading = true;
    this.camCardsFacade.loadCamCards(event.checked);
  }

  private isMoreThanLimit(containerSize: number) {
    return containerSize >= this.numberOfVisibleLineItems;
  }

  containerSize(quntity: number) {
    let containerSize = quntity * this.itemSize;

    if (this.isMoreThanLimit(quntity)) {
      containerSize = this.numberOfVisibleLineItems * this.itemSize;
    }

    return containerSize;
  }

  trackByCamCardFn(_, cc: CamCard) {
    return cc.id;
  }

  trackByCamCardItemFn(_, ccItem: CamCardItem) {
    return ccItem.id;
  }
}
