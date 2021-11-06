// tslint:disable: ish-ordered-imports ban-specific-imports
import { CdkDragDrop } from '@angular/cdk/drag-drop';
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
import { Observable, Subject } from 'rxjs';
import { first, skip, take, takeUntil } from 'rxjs/operators';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { AttributeHelper } from 'ish-core/models/attribute/attribute.helper';
import { BasketExtensions, GuestBasketExtensions } from 'ish-core/models/basket/basket.interface';
import { Bucket } from 'ish-core/models/basket/bucket.model';
import { CustomerDeliveryTerm } from 'ish-core/models/customer/customer.interface';
import { LineItemData } from 'ish-core/models/line-item/line-item.interface';
import { LineItem, LineItemView } from 'ish-core/models/line-item/line-item.model';
import { Price, PriceHelper } from 'ish-core/models/price/price.model';
import { ProductCompletenessLevel } from 'ish-core/models/product/product.model';
import { whenTruthy } from 'ish-core/utils/operators';
import { CamfilSmallCtaModalComponent } from 'ish-shared/components/common/camfil-small-cta-modal/camfil-small-cta-modal.component';

import { ModalAddNewProductComponent } from '../../../extensions/cam-cards/pages/account-cam-card-detail/modal-add-new-product/modal-add-new-product.component';

import { EditOrderModalComponent } from './edit-order-modal/edit-order-modal.component';
import { ORDER_HEADER_VALIDATORS } from './validators';
import { Address } from 'ish-core/models/address/address.model';
import { AddEmailRecipientModalComponent } from '../add-email-recipient-modal/add-email-recipient-modal.component';
import { TranslateService } from '@ngx-translate/core';
import { CheckoutFocusedElement } from 'ish-core/models/scroll-info copy/checkout-focused-element.interface';
import { Basket } from 'ish-core/models/basket/basket.model';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { AppFacade } from 'ish-core/facades/app.facade';
import { Channel } from 'ish-core/models/channel/channel.types';
import { DeviceType } from 'ish-core/models/viewtype/viewtype.types';
import { AccountFacade } from 'ish-core/facades/account.facade';

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

  @Input() order: Bucket;
  @Input() buckets: Bucket[];
  @Input() basket: Basket;
  @Input() isConfirmed: boolean;
  @Input() index: number;
  @Input() isLoggedIn = false;

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
  deliveryTerm: CustomerDeliveryTerm;
  basketInvoiceAddress: Address;
  closedDates;
  calendarException = [];
  orderAddress = {};
  emailRecipients: string[];
  basketExtensions: BasketExtensions[];
  deliveryDateValue: string;
  focusedElement: CheckoutFocusedElement;
  focusedElementId: string;
  forceUpdateForm = false;
  hideRecipientButton = false;
  itemSize = 90;

  calendarExceptions$: Observable<[]>;
  emailRecipients$: Observable<string[]>;
  focusedCheckoutElement$: Observable<CheckoutFocusedElement>;
  isLoggedIn$: Observable<boolean>;
  deviceType$: Observable<DeviceType>;

  private destroy$ = new Subject<void>();
  private numberOfVisibleLineItems = 20;

  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    private checkoutFacade: CheckoutFacade,
    private shoppingFacade: ShoppingFacade,
    private translate: TranslateService,
    private appFacade: AppFacade,
    private accountFacade: AccountFacade
  ) {}

  get currentBasketExtensions() {
    return {
      ...this.order,
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
    return this.deliveryDateValue ? this.deliveryDateValue : this.order?.deliveryDate;
  }

  get shipToAddress() {
    return { ...this.order?.shipToAddressFull, countryCode: '' };
  }

  get freeDelivery() {
    const total = this.totalPrice();
    const threshold = this.deliveryTerm.threshold;
    return { ...total, value: threshold - total.value };
  }

  get deliveryDaysForItemsAfterConfirmation() {
    // Order delivery date
    const numDeliveryDate = this.getDateAt24(new Date(this.deliveryDate)).getTime();
    // Get Earliest delivery days for each item
    const items = this.order && this.order.lineItems;

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
    this.isLoggedIn$ = this.accountFacade.isLoggedIn$;
    this.calendarExceptions$ = this.checkoutFacade.calendarExceptions$;

    this.orderAddress = this.shipToAddress;
    this.emailRecipients$ = this.checkoutFacade.getBucketEmailRecipients$(this.order?.shipToAddressFull?.id);

    this.emailRecipients$?.pipe(whenTruthy(), takeUntil(this.destroy$)).subscribe(value => {
      this.emailRecipients = value?.filter(er => er !== '');
    });

    this.calendarExceptions$.pipe(whenTruthy(), takeUntil(this.destroy$)).subscribe(exceptions => {
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
    this.focusedCheckoutElement$.pipe(takeUntil(this.destroy$)).subscribe((focusedElement: CheckoutFocusedElement) => {
      if (focusedElement) {
        this.focusedElement = focusedElement;
        this.focusedElementId = focusedElement.elementId;
      }
    });

    if (this.order) {
      this.checkoutFacade.basketInvoiceAddress$
        .pipe(whenTruthy(), takeUntil(this.destroy$))
        .subscribe(address => (this.basketInvoiceAddress = address));
      this.initForm();
      this.checkoutFacade.getCustomersDeliveryTerms$.pipe(whenTruthy(), takeUntil(this.destroy$)).subscribe(terms => {
        this.deliveryTerm = terms[this.order?.customer?.id];
      });
      this.handleDeliveryDateIfOutOfDate();
    }

    this.appFacade.getChannel$?.pipe(takeUntil(this.destroy$)).subscribe(channel => {
      if (channel === Channel.FI) {
        this.hideRecipientButton = true;
      }
    });

    this.deviceType$ = this.appFacade.deviceType$;
    this.deviceType$?.pipe(takeUntil(this.destroy$)).subscribe(deviceType => {
      this.itemSize = deviceType === 'mobile' ? 255 : deviceType === 'tablet' ? 155 : 90;
    });
  }

  getBoxLabel(lineItem: LineItem) {
    return lineItem?.attributes?.find(att => att.name === 'boxLabel')?.value;
  }

  ngOnChanges(s) {
    if (s.order && this.forceUpdateForm) {
      this.orderForm.patchValue({
        orderMark: this.order.orderMark,
        invoiceLabel: this.order.invoiceLabel,
        info: this.order.info,
      });
      this.orderAddress = this.shipToAddress;
      this.forceUpdateForm = false;
    }

    if (s?.buckets?.previousValue?.length !== s?.buckets?.currentValue?.length) {
      this.handleHeightItemsContainer(this.order?.lineItems);
      this.virtualScrollViewport?.checkViewportSize();
    }

    const prev = s?.order?.previousValue?.deliveryDate;
    const current = s?.order?.currentValue?.deliveryDate;
    if (prev && current && prev !== current) {
      this.orderForm.patchValue({
        deliveryDate: this.toDate(this.order.deliveryDate),
      });
    }
    const scroll = this.currentScrollIndex || this.order?.currentScrollIndex;
    setTimeout(() => this.virtualScrollViewport?.scrollToIndex(scroll));
  }

  ngAfterViewInit() {
    this.handleHeightItemsContainer(this.order?.lineItems);

    if (this.focusedElementId) {
      const focusTimeout = setTimeout(() => {
        const element = document.querySelector(`#${this.focusedElementId}`) as HTMLElement;
        element?.focus();
      }, 300);

      clearTimeout(focusTimeout);
    }

    this.virtualScrollViewport?.scrolledIndexChange.pipe(skip(1), takeUntil(this.destroy$)).subscribe(el => {
      this.currentScrollIndex = el;
    });
  }

  handleHeightItemsContainer(lineItems: LineItemView[]) {
    if (!this.isConfirmed) {
      const isMoreThanLimit = lineItems?.length >= this.numberOfVisibleLineItems;
      const numberOfItems = isMoreThanLimit ? this.numberOfVisibleLineItems : lineItems?.length;
      const viewportElement = this.virtualScrollViewport?.elementRef?.nativeElement;
      const bigLineItems = this.calculateLineItemHeight(lineItems)?.length;

      if (viewportElement) {
        // @ts-ignore
        viewportElement.style.height = `${numberOfItems * this.itemSize + bigLineItems * 12}px`;
        viewportElement.style.overflowY = isMoreThanLimit ? 'auto' : 'hidden';
        viewportElement.parentElement.classList.toggle('show-shadow', isMoreThanLimit);
      }
    }
  }

  calculateLineItemHeight(lineItems: LineItemView[]) {
    return (
      lineItems
        ?.map(li => {
          if (li.attributes.find(att => att.name === 'boxLabel' && att.value?.toString().length > 28)) {
            return li;
          }
        })
        ?.filter(li => li) || []
    );
  }

  changeViewportHeightOnBlur(type: string) {
    const viewportElement = this.virtualScrollViewport?.elementRef?.nativeElement;
    if (viewportElement) {
      viewportElement.style.height =
        type === 'increase' ? `${viewportElement.offsetHeight + 12}px` : `${viewportElement.offsetHeight - 12}px`;
    }
  }

  changeScrollIndex() {
    this.checkoutFacade.setBucketScrollIndex(this.order.shipToAddress, this.currentScrollIndex);
  }

  filterDates(date) {
    return !this.calendarException?.includes(date?.getTime());
  }

  initForm() {
    const defaultDeliveryDate = this.setFullDeliveryDate();

    this.orderForm = this.fb.group({
      orderMark: [this.order.orderMark, [Validators.maxLength(60)]],
      invoiceLabel: [this.order.invoiceLabel, [Validators.maxLength(60)]],
      info: [this.order.info, [Validators.maxLength(150)]],
      deliveryDate: [
        this.order?.deliveryDate?.length ? this.toDate(this.order.deliveryDate) : defaultDeliveryDate,
        [Validators.maxLength(35)],
      ],
    });
    this.selectedDeliveryDate = defaultDeliveryDate;
    this.isPartialDelivery = true;
  }

  onBlurSubmit(field: string) {
    const formField = this.getField(field);
    if (!formField.errors) {
      const { basket, deliveryAddressId } = this.order;

      const updated: BasketExtensions = {
        ...this.currentBasketExtensions,
        [field]: formField.value,
      };

      this.shoppingFacade.updateBucket(basket, deliveryAddressId, updated);
    }
  }

  submitGuestCheckout(guestBucketAddressData: GuestBasketExtensions) {
    const { basket, deliveryAddressId } = this.order;

    const updated: BasketExtensions = {
      ...this.currentBasketExtensions,
      ...guestBucketAddressData,
    };

    this.shoppingFacade.updateBucket(basket, deliveryAddressId, updated);
  }

  // tslint:disable-next-line:force-jsdoc-comments

  setFocusedElement(target: HTMLDataElement) {
    this.checkoutFacade.setCheckoutFocusedElement(target.id);
  }

  // tslint:disable-next-line:force-jsdoc-comments

  toggleOrder() {
    this.isOrderOpen = !this.isOrderOpen;
  }

  // tslint:disable-next-line:force-jsdoc-comments

  // TODO (extMlk): PERFORMANCE - it should be moved to applyPricing method instead of calling fn in template
  totalPrice(type = 'net'): Price {
    return PriceHelper.totalPrice(this.order?.lineItems, type);
  }

  // tslint:disable-next-line:force-jsdoc-comments

  // TODO (extMlk): PERFORMANCE - it should be moved to applyPricing method instead of calling fn in template
  totalTax(): Price {
    return PriceHelper.totalTax(this.order?.lineItems);
  }

  // tslint:disable-next-line:force-jsdoc-comments

  // TODO (extMlk): PERFORMANCE - it should be moved to applyPricing method instead of calling fn in template
  savedAmount(): Price {
    return PriceHelper.savedAmount(this.order?.lineItems);
  }

  // TODO (extMlk): PERFORMANCE - it should be moved to applyPricing method instead of calling fn in template
  discount(): Price {
    return PriceHelper.discount(this.order?.lineItems);
  }

  // TODO (extMlk) it should be moved to applyPricing method instead of calling fn in template
  getVolumeDiscountPrice(value, currency) {
    return PriceHelper.getVolumeDiscountPrice(value, currency, this.translate.currentLang);
  }

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

  openEditModal(modal: EditOrderModalComponent) {
    this.dialog.open(modal.show());
    modal.hide = () => this.dialog.closeAll();
    modal.additionalActionOnSubmit = () => {
      this.forceUpdateForm = true;
    };
  }

  setFullDeliveryDate() {
    /** Get earliest delivery date for every line item */
    const items = this.order && this.order.lineItems;

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
    const orderDeliveryDate = new Date(this.order.deliveryDate).getTime();

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
    const basketId = this.order.basket;
    const shipAddressId = this.order.deliveryAddressId;

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
      if (this.order.lineItems?.length > 1) {
        this.dialog.open(this.modal?.show());
      }

      this.modal.hide = () => {
        this.dialog.closeAll();
      };
    }

    /* call c after dialog is closed either by click, backdrop click, or ESC press */
    this.dialog.afterAllClosed.pipe(first(), takeUntil(this.destroy$)).subscribe(() => {
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
    const { basket, deliveryAddressId } = this.order;
    this.checkoutFacade.doubleBucketItemsQuantity(basket, deliveryAddressId);
  }

  openAddEmailRecipientModal() {
    this.dialog.open(AddEmailRecipientModalComponent, {
      width: '360px',
      autoFocus: false,
      data: { ...this.currentBasketExtensions, emailRecipients: this.currentBasketExtensions?.emailRecipients || [] },
    });
  }

  removeSelectedRecipient(recipient) {
    const updatedRecipients = this.emailRecipients.filter(er => er !== recipient);

    const { basket, deliveryAddressId } = this.order;
    const basketExtensionUpdate: BasketExtensions = {
      ...this.order,
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
}
