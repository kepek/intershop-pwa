import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { CamfilConfigurationFacade } from 'camfil-pwa/facades/camfil-configuration.facade';
import { QuickAddProduct } from 'camfil-pwa/models/camfil-quick-add-product/camfil-quick-add-product.model';
import { Observable, ReplaySubject, Subject, combineLatest } from 'rxjs';
import { first, map, switchMap, take, takeUntil } from 'rxjs/operators';
import { CamfilCheckoutGoodsAcceptanceModalComponent } from 'src/app/pages/camfil-checkout-onestep/camfil-checkout-goods-acceptance-modal/camfil-checkout-goods-acceptance-modal.component';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { AppFacade } from 'ish-core/facades/app.facade';
import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { AddressHelper } from 'ish-core/models/address/address.helper';
import { Address } from 'ish-core/models/address/address.model';
import { AttributeHelper } from 'ish-core/models/attribute/attribute.helper';
import { BasketExtensionData } from 'ish-core/models/basket-extension/basket-extension.interface';
import { BasketExtension } from 'ish-core/models/basket-extension/basket-extension.model';
import { Basket } from 'ish-core/models/basket/basket.model';
import { BucketTotal } from 'ish-core/models/bucket-total/bucket-total.model';
import { Bucket } from 'ish-core/models/bucket/bucket.model';
import { Channel } from 'ish-core/models/channel/channel.types';
import { CustomerDeliveryTerm } from 'ish-core/models/customer/customer.interface';
import { LineItemData } from 'ish-core/models/line-item/line-item.interface';
import { LineItem, LineItemView } from 'ish-core/models/line-item/line-item.model';
import { Price, PriceHelper } from 'ish-core/models/price/price.model';
import { ProductCompletenessLevel } from 'ish-core/models/product/product.model';
import { CheckoutFocusedElement } from 'ish-core/models/scroll-info copy/checkout-focused-element.interface';
import { DeviceType } from 'ish-core/models/viewtype/viewtype.types';
import { whenTruthy } from 'ish-core/utils/operators';
import { CamfilSmallCtaModalComponent } from 'ish-shared/components/common/camfil-small-cta-modal/camfil-small-cta-modal.component';

import { ModalAddNewProductComponent } from '../../../extensions/cam-cards/pages/account-cam-card-detail/modal-add-new-product/modal-add-new-product.component';
import { CamfilCheckoutAddEmailRecipientModalComponent } from '../../../pages/camfil-checkout-onestep/camfil-checkout-add-email-recipient-modal/camfil-checkout-add-email-recipient-modal.component';

import { CamfilEditOrderModalComponent } from './camfil-edit-order-modal/camfil-edit-order-modal.component';
import { ORDER_HEADER_VALIDATORS } from './validators';

@Component({
  selector: 'camfil-checkout-bucket',
  templateUrl: './camfil-checkout-bucket.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./camfil-checkout-bucket.component.scss'],
})
export class CamfilCheckoutBucketComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {
  @ViewChild(CamfilSmallCtaModalComponent) modal: CamfilSmallCtaModalComponent;
  @ViewChild(CdkVirtualScrollViewport, { static: false }) virtualScrollViewport: CdkVirtualScrollViewport;
  @ViewChild('bucketListItem') bucketListItem: ElementRef;

  @Input() bucket: Bucket;
  @Input() totalBuckets: number;
  @Input() basket: Basket;
  @Input() editable: boolean;
  @Input() index: number;

  currentScrollIndex?: number;
  isOrderOpen = true;
  orderForm: FormGroup;
  validators = ORDER_HEADER_VALIDATORS;
  selectedDeliveryDate: number;
  firstAvailableDelivery: string;
  deliveryDatesRange: Date[];
  fullDeliveryDate: string;
  orderFullDeliveryDate: number;
  modalDeliveryText: string;
  isPartialDelivery = false;
  basketInvoiceAddress: Address;
  closedDates;
  calendarException = [];
  orderAddress: Address;
  emailRecipients: string[];
  goodsAcceptanceNote: string;
  basketExtensions: BasketExtension[];
  deliveryDateValue: string;
  focusedElement: CheckoutFocusedElement;
  focusedElementId: string;
  forceUpdateForm = false;
  hideRecipientButton = false;
  itemSize = 100;
  basketAddresses: Address[];

  calendarExceptions$: Observable<[]>;
  emailRecipients$: Observable<string[]>;
  focusedCheckoutElement$: Observable<CheckoutFocusedElement>;
  isLoggedIn$: Observable<boolean>;
  deviceType$: Observable<DeviceType>;
  pageletIds$: Observable<string[]>;
  deliveryTerm$: Observable<CustomerDeliveryTerm>;
  deliveryPrice$: Observable<Price>;
  showDeliveryTerm$: Observable<boolean>;
  totals: BucketTotal;
  isNewAddress = AddressHelper.isNewAddress;
  getUrn = AddressHelper.getUrn;
  getId = AddressHelper.getId;

  private bucket$ = new ReplaySubject<Bucket>(1);
  private shipToAddressFullId$ = new ReplaySubject<string>(1);
  private destroy$ = new Subject<void>();
  private numberOfVisibleLineItems = 20;

  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    private checkoutFacade: CheckoutFacade,
    private shoppingFacade: ShoppingFacade,
    private appFacade: AppFacade,
    private accountFacade: AccountFacade,
    private camfilConfigurationFacade: CamfilConfigurationFacade
  ) {}

  get isMoreThanLimit() {
    return this.bucket?.lineItems?.length >= this.numberOfVisibleLineItems;
  }

  get containerSize() {
    let containerSize = this.bucket?.lineItems?.length * this.itemSize;

    if (this.isMoreThanLimit) {
      containerSize = this.numberOfVisibleLineItems * this.itemSize;
    }

    return containerSize + 2;
  }

  get currentBasketExtensions() {
    return {
      ...this.bucket,
      ...this.currentFormFields,
      deliveryDate: this.deliveryDate,
      emailRecipients: this.emailRecipients ? [...this.emailRecipients] : [],
      isPartialDelivery: this.isPartialDelivery,
    };
  }

  get currentFormFields() {
    return this.orderForm?.value;
  }

  get deliveryDate() {
    return this.deliveryDateValue ? this.deliveryDateValue : this.bucket?.deliveryDate;
  }

  get shipToAddress() {
    return { ...this.bucket?.shipToAddressFull, countryCode: '' };
  }

  get deliveryDaysForItemsAfterConfirmation() {
    // Order delivery date
    const numDeliveryDate = this.getDateAt24(new Date(this.deliveryDate)).getTime();
    // Get Earliest delivery days for each item
    const items = this.bucket && this.bucket.lineItems;

    return (
      items
        ?.reduce((acc, li) => {
          // Set delivery date for each item
          const earliestDeliveryDate = this.getDateAt24(new Date(li.earliestDeliveryDate)).getTime();
          const dateToPush = earliestDeliveryDate < numDeliveryDate ? numDeliveryDate : earliestDeliveryDate;

          return dateToPush && !acc.includes(dateToPush) ? [...acc, dateToPush] : acc;
        }, [])
        .sort() || []
    );
  }

  ngOnInit(): void {
    this.orderAddress = this.shipToAddress;

    this.isLoggedIn$ = this.accountFacade.isLoggedIn$;
    this.calendarExceptions$ = this.checkoutFacade.calendarExceptions$;

    this.shipToAddressFullId$
      .pipe(
        switchMap(id =>
          combineLatest([
            this.checkoutFacade.getBucketEmailRecipients$(id),
            this.checkoutFacade.getBucketGoodsAcceptanceNote$(id),
          ])
        )
      )
      .pipe(takeUntil(this.destroy$))
      ?.subscribe(([emailRecipients, goodsAcceptanceNote]) => {
        this.emailRecipients = emailRecipients;
        this.goodsAcceptanceNote = goodsAcceptanceNote;
      });

    this.deliveryTerm$ = combineLatest([
      this.checkoutFacade.getCustomersDeliveryTerms$.pipe(whenTruthy()),
      this.bucket$,
    ])?.pipe(
      map(([deliveryTerms, bucket]) => ({ deliveryTerm: deliveryTerms?.[bucket?.customer?.id], bucket })),
      map(({ deliveryTerm, bucket }) => ({
        ...deliveryTerm,
        freeShippingAllowed:
          deliveryTerm?.freeShippingAllowed && bucket?.totals?.itemTotal?.net > deliveryTerm?.threshold,
      }))
    );

    this.deliveryPrice$ = combineLatest([this.deliveryTerm$.pipe(whenTruthy()), this.bucket$])?.pipe(
      map(([deliveryTerm, bucket]) => {
        const emptyPrice = PriceHelper.empty();
        const threshold = deliveryTerm?.threshold || 0;
        const totalNetValue = bucket?.totals?.itemTotal?.net || 0;
        const currency = bucket?.purchaseCurrency;
        const price = deliveryTerm.freeShippingAllowed || threshold === 0 ? 0 : threshold - totalNetValue;
        return { ...emptyPrice, value: price > 0 ? price : 0, currency };
      })
    );

    this.calendarExceptions$?.pipe(whenTruthy(), takeUntil(this.destroy$))?.subscribe(exceptions => {
      this.calendarException = exceptions.map((element: { date: string }) => {
        const date = new Date(element.date);
        date.setHours(0, 0, 0);
        return date.getTime();
      });

      const deliveryDateControl = this.orderForm?.get('deliveryDate');

      if (deliveryDateControl) {
        if (!this.calendarException.length) {
          deliveryDateControl.disable();
        } else {
          deliveryDateControl.enable();
        }
      }
    });

    this.focusedCheckoutElement$ = this.checkoutFacade.getFocusedCheckoutElement$;
    this.focusedCheckoutElement$
      ?.pipe(takeUntil(this.destroy$))
      ?.subscribe((focusedElement: CheckoutFocusedElement) => {
        if (focusedElement) {
          this.focusedElement = focusedElement;
          this.focusedElementId = focusedElement.elementId;
        }
      });

    if (this.bucket) {
      this.checkoutFacade.basketInvoiceAddress$
        ?.pipe(whenTruthy(), takeUntil(this.destroy$))
        ?.subscribe(address => (this.basketInvoiceAddress = address));
      this.initForm();
      this.handleDeliveryDateIfOutOfDate();
    }

    this.appFacade.getChannel$?.pipe(takeUntil(this.destroy$))?.subscribe(channel => {
      if (channel === Channel.FI) {
        // TODO (extMlk): allowToAddEmailRecipientsInCheckout setting
        this.hideRecipientButton = true;
      }
    });

    this.deviceType$ = this.appFacade.deviceType$;
    this.deviceType$?.pipe(takeUntil(this.destroy$))?.subscribe(deviceType => {
      this.itemSize = deviceType === 'mobile' ? 255 : deviceType === 'tablet' ? 155 : 100;
    });

    this.pageletIds$ = this.camfilConfigurationFacade
      ?.isEnabled$('showWarningMessageForPartialDelivery')
      ?.pipe(
        map(showWarningMessageForPartialDelivery =>
          showWarningMessageForPartialDelivery
            ? ['camfil.include.checkout.warning.message.content.pagelet2-Include']
            : []
        )
      );

    this.shoppingFacade.basketAddresses$.pipe(takeUntil(this.destroy$)).subscribe((basketAddresses: Address[]) => {
      this.basketAddresses = basketAddresses;
    });
  }

  getBoxLabel(lineItem: LineItem) {
    return lineItem?.attributes?.find(att => att.name === 'boxLabel')?.value;
  }

  ngOnChanges(s) {
    this.bucket$.next(this.bucket);
    this.shipToAddressFullId$.next(this.bucket?.shipToAddressFull?.id);

    if (s.bucket && this.forceUpdateForm) {
      this.orderForm.patchValue({
        orderMark: this.bucket.orderMark,
        invoiceLabel: this.bucket.invoiceLabel,
        info: this.bucket.info,
      });
      this.forceUpdateForm = false;
    }

    if (s.bucket) {
      this.orderAddress = this.shipToAddress;
    }

    if (!s?.totalBuckets?.firstChange && s?.totalBuckets?.previousValue !== s?.totalBuckets?.currentValue) {
      this.orderForm?.patchValue({
        orderMark: this.bucket.orderMark,
        invoiceLabel: this.bucket.invoiceLabel,
        info: this.bucket.info,
      });
    }

    const prev = s?.order?.previousValue?.deliveryDate;
    const current = s?.order?.currentValue?.deliveryDate;
    if (prev && current && prev !== current) {
      this.orderForm.patchValue({
        deliveryDate: this.toDate(this.bucket.deliveryDate),
      });
    }
  }

  ngAfterViewInit() {
    if (this.focusedElementId) {
      const focusTimeout = setTimeout(() => {
        const element = document.querySelector(`#${this.focusedElementId}`) as HTMLElement;
        element?.focus();
      }, 300);

      clearTimeout(focusTimeout);
    }

    const viewportElement = this.virtualScrollViewport?.elementRef?.nativeElement;

    if (viewportElement) {
      viewportElement.parentElement.classList.toggle('show-shadow', this.isMoreThanLimit);
    }
  }

  calculateLineItemHeight(lineItems: LineItemView[]) {
    return (
      lineItems
        ?.map(li => {
          if (li.attributes.find(att => att.name === 'boxLabel' && Number(att?.value?.toString()?.length) > 28)) {
            return li;
          }
        })
        ?.filter(li => li) || []
    );
  }

  changeScrollIndex() {
    this.checkoutFacade.setBucketScrollIndex(this.bucket.shipToAddress, this.currentScrollIndex);
  }

  filterDates(date) {
    return !this.calendarException?.includes(date?.getTime());
  }

  initForm() {
    const defaultDeliveryDate = this.setFullDeliveryDate();

    this.orderForm = this.fb.group({
      orderMark: [this.bucket.orderMark, [Validators.maxLength(60)]],
      invoiceLabel: [this.bucket.invoiceLabel, [Validators.maxLength(60)]],
      info: [this.bucket.info, [Validators.maxLength(150)]],
      deliveryDate: [
        this.bucket?.deliveryDate?.length ? this.toDate(this.bucket.deliveryDate) : defaultDeliveryDate,
        [Validators.maxLength(35)],
      ],
    });
    this.selectedDeliveryDate = defaultDeliveryDate;
    this.isPartialDelivery = true;
  }

  onBlurSubmit(field: string) {
    const formField = this.getField(field);
    if (!formField.errors) {
      const { basket, deliveryAddressId } = this.bucket;

      const updated: BasketExtensionData = {
        ...this.currentBasketExtensions,
        [field]: formField.value,
      };

      this.shoppingFacade.updateBucket(basket, deliveryAddressId, updated);
    }
  }

  setFocusedElement(target: HTMLDataElement) {
    this.checkoutFacade.setCheckoutFocusedElement(target.id);
  }

  toggleOrder() {
    this.isOrderOpen = !this.isOrderOpen;
  }

  openAddToProductModal(modal: ModalAddNewProductComponent) {
    const dialogRef = this.dialog.open(modal.show());
    modal.hide = () => this.dialog.closeAll();

    dialogRef
      ?.afterClosed()
      ?.pipe(take(1), takeUntil(this.destroy$))
      ?.subscribe(() => {
        modal.reset();
      });
  }

  getTargetPosition(previousIndex, currentIndex, items) {
    // sort first because currentIndex contains only the 'visible' position
    items.sort((a, b) => (a.position < b.position ? -1 : 1));
    let predecessorPos;
    let successorPos;
    let targetPos;

    if (previousIndex === undefined || previousIndex > currentIndex) {
      /** moving line item upwards */
      predecessorPos = items[currentIndex - 1]?.position;
      successorPos = items[currentIndex]?.position;
    } else {
      /** moving line item downwards */
      predecessorPos = items[currentIndex]?.position;
      successorPos = items[currentIndex + 1]?.position;
    }

    if (predecessorPos === undefined && successorPos === undefined) {
      return; /** Current position  */
    } else if (predecessorPos === undefined) {
      targetPos = successorPos; /** Successor position - update all succesors  */
    } else if (successorPos === undefined) {
      targetPos = predecessorPos; /** Predecesor position  */
    } else {
      const gap = successorPos - predecessorPos;
      targetPos = Math.round(gap / 2) + predecessorPos;
    }
    return targetPos ? targetPos : 1;
  }

  camfilDragLineItem(lineItem: LineItem, targetBucket: Bucket, position: number) {
    const basketId = targetBucket.basket;
    const updatedLineItem = {
      ...lineItem,
      position,
    };
    this.checkoutFacade.camfilDragLineItem(basketId, updatedLineItem, targetBucket);
  }

  drop(event: CdkDragDrop<LineItemView[]>, targetOrder: Bucket) {
    if (event.previousContainer === event.container) {
      if (event.previousIndex === event.currentIndex) {
        return;
      }
      const items: LineItemData[] = Object.keys(event.container.data).map(i => event.container.data[i]);
      const targetPos = this.getTargetPosition(event.previousIndex, event.currentIndex, items);
      this.camfilDragLineItem(event.item.data, targetOrder, targetPos);
    } else {
      /** Move line item to different bucket */
      const items: LineItemData[] = Object.keys(event.container.data).map(i => event.container.data[i]);
      const targetPos = this.getTargetPosition(event.previousIndex, event.currentIndex, items);
      this.camfilDragLineItem(event.item.data, targetOrder, targetPos);
    }
  }

  getField(name: string) {
    return this.orderForm?.get(name);
  }

  openEditModal(modal: CamfilEditOrderModalComponent) {
    this.dialog.open(modal.show());
    modal.hide = () => this.dialog.closeAll();
    modal.additionalActionOnSubmit = () => {
      this.forceUpdateForm = true;
    };
  }

  setFullDeliveryDate() {
    /** Get earliest delivery date for every line item */
    const items = this.bucket && this.bucket.lineItems;

    /** Get this order extensions */
    this.isPartialDelivery = this.currentBasketExtensions?.isPartialDelivery || false;
    if (items?.length) {
      const datesList = [
        ...new Set(
          items
            // Stop if no earliestDeliveryDate available?
            .filter(o => !!o?.earliestDeliveryDate)
            .map(o => {
              let delivery = new Date(o.earliestDeliveryDate);
              delivery = this.checkIfWeekend(delivery) ? this.setToClosestMonday(delivery) : delivery;
              return delivery.getTime();
            })
            .sort()
        ),
      ];

      const min = datesList[0];
      const max = datesList[datesList.length - 1];

      // TODO (extMlk): Not sure if we should display N/A or try to predict the date?
      if (!min || !max) {
        return new Date().getTime();
      }

      if (min !== max) {
        this.setDaysClass(min, new Date(max));
      }

      this.firstAvailableDelivery = new Date(min).toISOString();
      this.fullDeliveryDate = new Date(max).toISOString();

      return max;
    } else {
      return new Date().getTime();
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  handleDeliveryDateIfOutOfDate() {
    const firstAvailable = new Date(this.firstAvailableDelivery).getTime();
    const orderDeliveryDate = new Date(this.bucket.deliveryDate).getTime();

    if (orderDeliveryDate < firstAvailable) {
      // tslint:disable-next-line:ish-no-object-literal-type-assertion
      const date = { value: new Date(this.firstAvailableDelivery) } as MatDatepickerInputEvent<Date>;
      this.changeDeliveryDate(date);
    }
  }

  setDaysClass(startDate: number, endDate: Date) {
    let dates = [];
    const days = [];
    const theDate = new Date(startDate);
    while (theDate <= endDate) {
      dates = [...dates, new Date(theDate)];
      theDate.setDate(theDate.getDate() + 1);
    }
    dates.forEach(date => {
      days.push(date);
    });
    this.deliveryDatesRange = [...days];
  }

  dateClass = (d: Date) => {
    const day = d.getDate();
    const month = d.getMonth();
    const ranges = this.deliveryDatesRange;
    let classes = '';
    if (ranges?.find(date => date.getMonth() === month && date.getDate() === day)) {
      if (ranges.length === 1) {
        classes = 'one-day-date-class';
      } else {
        classes = 'custom-date-class';
        if (ranges[0].getDate() === day && ranges[0].getMonth() === month) {
          classes += ' first-day-range';
        } else if (ranges[ranges.length - 1].getDate() === day && ranges[ranges.length - 1].getMonth() === month) {
          classes += ' last-day-range';
        }
      }
    }
    return classes;
  };

  changeDeliveryDate(event: MatDatepickerInputEvent<Date>) {
    const fullDD = new Date(this.fullDeliveryDate).setHours(0, 0, 0, 0);
    const selectedDD = new Date(event.value).setHours(0, 0, 0, 0);

    if (fullDD === selectedDD || selectedDD > fullDD || !fullDD) {
      this.modalDeliveryText = 'camfil.modal.checkout.full-delivery.title';
      this.updateBucketDeliveryDate(false, selectedDD);
    } else {
      this.modalDeliveryText = 'camfil.modal.checkout.partial-delivery.title';
      this.updateBucketDeliveryDate(true, selectedDD);
    }
  }

  updateBucketDeliveryDate(isPartial: boolean, deliveryDate: number) {
    const basketId = this.bucket.basket;
    const shipAddressId = this.bucket.deliveryAddressId;

    const deliveryDateValue = AttributeHelper.formatDeliveryDate(new Date(deliveryDate));
    this.deliveryDateValue = deliveryDateValue;

    this.selectedDeliveryDate = deliveryDate;
    this.isPartialDelivery = isPartial;

    const basketExtensionUpdate = {
      ...this.currentBasketExtensions,
      deliveryDate: deliveryDateValue,
      isPartialDelivery: isPartial,
    };

    if (this.modal) {
      // CAM-1504: Only display popup when bucket contains more then one line items
      if (this.bucket.lineItems?.length > 1) {
        this.dialog.open(this.modal?.show());
      }

      this.modal.hide = () => {
        this.dialog.closeAll();
      };
    }

    /* call c after dialog is closed either by click, backdrop click, or ESC press */
    this.dialog.afterAllClosed?.pipe(first(), takeUntil(this.destroy$))?.subscribe(() => {
      this.shoppingFacade.updateBucket(basketId, shipAddressId, basketExtensionUpdate);
    });
  }

  toDate(dateStr) {
    const parts = dateStr.split('-');
    let dateString = new Date(parts[0], parts[1] - 1, parts[2]);

    if (this.checkIfWeekend(dateString)) {
      dateString = this.setToClosestMonday(dateString);
    }

    this.selectedDeliveryDate = dateString.getTime();

    return dateString.toISOString();
  }

  checkIfWeekend(date) {
    return date?.getDay() === 6 || date?.getDay() === 0;
  }

  setToClosestMonday(date) {
    switch (date?.getDay()) {
      case 6:
        date.setDate(date.getDate() + 2);
        break;
      case 0:
        date.setDate(date.getDate() + 1);
        break;
      default:
        break;
    }
    return new Date(date);
  }

  doubleArticlesQuantity() {
    const { basket, deliveryAddressId } = this.bucket;
    this.checkoutFacade.doubleBucketItemsQuantity(basket, deliveryAddressId);
  }

  openAddEmailRecipientModal() {
    this.dialog.open(CamfilCheckoutAddEmailRecipientModalComponent, {
      width: '360px',
      autoFocus: false,
      data: { ...this.currentBasketExtensions, emailRecipients: this.currentBasketExtensions?.emailRecipients || [] },
    });
  }

  removeSelectedRecipient(recipient) {
    const updatedRecipients = this.emailRecipients.filter(er => er !== recipient);

    const { basket, deliveryAddressId } = this.bucket;
    const basketExtensionUpdate: BasketExtensionData = {
      ...this.bucket,
      ...this.currentBasketExtensions,
      emailRecipients: updatedRecipients,
    };

    this.shoppingFacade.updateBucket(basket, deliveryAddressId, basketExtensionUpdate);
  }

  trackBy(_, lineItem: LineItemView) {
    return lineItem.id;
  }

  product$(sku: string) {
    return this.shoppingFacade.product$(sku, ProductCompletenessLevel.List);
  }

  getDateAt24(date: Date) {
    const yyyy = date.getFullYear();
    const mm = date.getMonth() + 1;
    const dd = date.getDate();
    return new Date(`${yyyy}-${mm}-${dd} 23:59`);
  }

  // ------------ Quick add product Functions ------------
  addProductToExistingOrder(sku, quantity, shipToAddress, lineItemAttributes) {
    this.shoppingFacade.addProductToBasket(
      sku,
      quantity,
      this.basket?.commonShippingMethod?.id,
      shipToAddress,
      lineItemAttributes
    );
  }

  addProductToNewOrder(sku, quantity, deliveryAddress, bucketId, lineItemAttributes, basketAddresses) {
    if (this.isNewAddress(deliveryAddress, basketAddresses)) {
      this.shoppingFacade.addProductToBucket(
        deliveryAddress,
        this.bucket.shippingMethod,
        sku,
        quantity,
        this.bucket.basket,
        {
          ...this.bucket,
        },
        lineItemAttributes,
        bucketId
      );
    } else {
      this.shoppingFacade.addProductToBucketWithUrn(
        this.getUrn(deliveryAddress, basketAddresses),
        this.getId(deliveryAddress, basketAddresses),
        this.bucket.shippingMethod,
        sku,
        quantity,
        this.bucket.basket,
        lineItemAttributes
      );
    }
  }

  submitQuickAddProd(quickAddData: QuickAddProduct, modal: ModalAddNewProductComponent) {
    const type = this.bucket?.id?.split('_')?.[0];
    const shipToAddress = this.bucket.shipToAddress;

    const { sku, quantity, lineItemAttributes } = quickAddData;
    if (this.bucket?.id && type !== 'emptyBucket' && this.bucket?.shipToAddress) {
      this.addProductToExistingOrder(sku, quantity, shipToAddress, lineItemAttributes);
    } else {
      const deliveryAddress = this.bucket.shipToAddressFull as Address;
      this.addProductToNewOrder(
        sku,
        quantity,
        deliveryAddress,
        this.bucket.id,
        lineItemAttributes,
        this.basketAddresses
      );
    }

    combineLatest([this.shoppingFacade.productUpdated$.pipe(take(1)), this.shoppingFacade.productAdded$.pipe(take(1))])
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        if (modal) {
          modal.hide();
          modal.reset();
        }
      });
  }

  openEditGoodsAcceptanceTimeModal() {
    const deliveryAddress = this.bucket.shipToAddressFull as Address;
    this.dialog.open(CamfilCheckoutGoodsAcceptanceModalComponent, {
      width: '360px',
      autoFocus: false,
      data: {
        ...deliveryAddress,
        goodsAcceptanceNote: this.goodsAcceptanceNote || '',
      },
    });
  }
}
