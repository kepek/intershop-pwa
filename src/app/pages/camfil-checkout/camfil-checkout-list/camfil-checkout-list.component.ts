// tslint:disable: ish-ordered-imports ban-specific-imports
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { Observable, Subject } from 'rxjs';
import { first, take, takeUntil } from 'rxjs/operators';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { AttributeHelper } from 'ish-core/models/attribute/attribute.helper';
import { BasketExtensions } from 'ish-core/models/basket/basket.interface';
import { Bucket } from 'ish-core/models/basket/bucket.model';
import { CustomerDeliveryTerm } from 'ish-core/models/customer/customer.interface';
import { LineItemData } from 'ish-core/models/line-item/line-item.interface';
import { LineItem } from 'ish-core/models/line-item/line-item.model';
import { Price, PriceHelper } from 'ish-core/models/price/price.model';
import { ProductViewHelper } from 'ish-core/models/product-view/product-view.helper';
import { ProductView } from 'ish-core/models/product-view/product-view.model';
import { ProductCompletenessLevel } from 'ish-core/models/product/product.model';
import { whenTruthy } from 'ish-core/utils/operators';
import { CamfilSmallCtaModalComponent } from 'ish-shared/components/common/camfil-small-cta-modal/camfil-small-cta-modal.component';

import { ModalAddNewProductComponent } from '../../../extensions/cam-cards/pages/account-cam-card-detail/modal-add-new-product/modal-add-new-product.component';

import { EditOrderModalComponent } from './edit-order-modal/edit-order-modal.component';
import { ORDER_HEADER_VALIDATORS } from './validators';
import { LineItemUpdate } from 'ish-core/models/line-item-update/line-item-update.model';
import { Address } from 'ish-core/models/address/address.model';
import { AddEmailRecipientModalComponent } from '../add-email-recipient-modal/add-email-recipient-modal.component';
import { TranslateService } from '@ngx-translate/core';

interface Order extends Bucket {
  totals: number;
}

@Component({
  selector: 'camfil-checkout-list',
  templateUrl: './camfil-checkout-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./camfil-checkout-list.component.scss'],
})
export class CamfilCheckoutListComponent implements OnInit, OnDestroy {
  private static REQUIRED_COMPLETENESS_LEVEL = ProductCompletenessLevel.List;
  @Input() order: Order;
  @Input() buckets: Bucket[];
  @Input() purchaseCurrency: string;
  isOrderOpen = true;
  orderForm: FormGroup;

  validators = ORDER_HEADER_VALIDATORS;
  @Input() shippingMethodId: string;
  @Input() basket;
  @Input() isConfirmed;
  @Input() totalOrders;
  @Input() index;

  @Output() handleProduct = new EventEmitter<ProductView>();
  calculatedOrder;

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
  calendarExceptions$: Observable<[]>;
  calendarException = [];
  orderAddress = {};
  emailRecipients: string[];
  emailRecipients$: Observable<string[]>;
  basketExtensions: BasketExtensions[];
  basketExtensions$: Observable<BasketExtensions[]>;
  deliveryDateValue: string;
  basketLoading$: Observable<boolean>;

  @ViewChild(CamfilSmallCtaModalComponent) modal: CamfilSmallCtaModalComponent;

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    public dialog: MatDialog,
    private checkoutFacade: CheckoutFacade,
    private shoppingFacade: ShoppingFacade,
    private translate: TranslateService
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

  ngOnInit(): void {
    this.calendarExceptions$ = this.checkoutFacade.calendarExceptions$;

    this.orderAddress = { ...this.order.shipToAddressFull, countryCode: '' };
    this.basketLoading$ = this.checkoutFacade.basketLoading$;

    this.emailRecipients$ = this.checkoutFacade.getBucketEmailRecipients$(this.order?.shipToAddressFull?.id);

    this.emailRecipients$?.subscribe(value => {
      this.emailRecipients = value?.filter(er => er !== '');
    });

    this.calendarExceptions$.pipe(whenTruthy(), takeUntil(this.destroy$)).subscribe(exceptions => {
      this.calendarException = exceptions.map((element: { date: string }) => {
        const date = new Date(element.date);
        date.setHours(0, 0, 0);
        return date.getTime();
      });
    });

    if (this.order) {
      this.checkoutFacade.basketInvoiceAddress$
        .pipe(whenTruthy(), takeUntil(this.destroy$))
        .subscribe(address => (this.basketInvoiceAddress = address));
      this.initForm();
      this.checkoutFacade.getCustomersDeliveryTerms$.pipe(whenTruthy(), takeUntil(this.destroy$)).subscribe(terms => {
        this.deliveryTerm = terms[this.order?.customer?.id];
      });
    }
  }

  filterDates(date) {
    return !this.calendarException?.includes(date?.getTime());
  }

  initForm() {
    const defaultDeliveryDate = this.setFullDeliveryDate();

    this.orderForm = this.fb.group({
      orderMark: [this.order.orderMark, [Validators.maxLength(60)]],
      invoiceLabel: [this.order.invoiceLabel, [Validators.maxLength(20)]],
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

  handleProductLoad(product) {
    this.handleProduct.emit(product);
  }

  toggleOrder() {
    this.isOrderOpen = !this.isOrderOpen;
  }

  totalPrice(type = 'net'): Price {
    return PriceHelper.totalPrice(this.order?.lineItems, type);
  }

  totalTax(): Price {
    return PriceHelper.totalTax(this.order?.lineItems);
  }

  savedAmount(): Price {
    return PriceHelper.savedAmount(this.order?.lineItems);
  }

  discount(): Price {
    return PriceHelper.discount(this.order?.lineItems);
  }

  getVolumeDiscountPrice(value, currency) {
    return PriceHelper.getVolumeDiscountPrice(value, currency, this.translate.currentLang);
  }

  get freeDelivery() {
    const total = this.totalPrice();
    const threshold = this.deliveryTerm.threshold;
    return { ...total, value: threshold - total.value };
  }

  openAddToProductModal(modal: ModalAddNewProductComponent) {
    this.dialog.open(modal.show());
    modal.hide = () => this.dialog.closeAll();
  }

  sortBy() {
    const items: LineItemData[] = Object.keys(this.order.lineItems).map(i => this.order.lineItems[i]);

    return items.sort((a, b) => (a.position < b.position ? -1 : 1));
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

  drop(event: CdkDragDrop<string[]>, targetOrder: Bucket) {
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
  }

  setFullDeliveryDate() {
    /** Get earliest delivery date for every line item */
    let items = this.order && this.order.lineItems;

    /** Get this order extensions */
    this.isPartialDelivery = this.currentBasketExtensions?.isPartialDelivery || false;
    if (items?.length) {
      items = items.map(li => {
        const earliestDeliveryDate = this.getDeliveryDate(li.productSKU);
        return { ...li, earliestDeliveryDate };
      });
      const max = Math.max.apply(
        Math,
        items.map(o => o.earliestDeliveryDate)
      );

      let fullDeliveryDate = max;

      const min = Math.min.apply(
        Math,
        items.map(o => o.earliestDeliveryDate)
      );

      if (min && !Number.isNaN(min) && max && !Number.isNaN(max)) {
        this.firstAvailableDelivery = new Date(min).toISOString();
        fullDeliveryDate = new Date(max).toISOString();
        this.setDaysClass(min, max);
      }

      this.fullDeliveryDate = fullDeliveryDate;

      return fullDeliveryDate;
    } else {
      return new Date().toISOString();
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getDeliveryDate(lineItemId: string) {
    const productDetail$ = this.shoppingFacade.product$(
      lineItemId,
      CamfilCheckoutListComponent.REQUIRED_COMPLETENESS_LEVEL
    );
    let delivery;
    productDetail$.pipe(take(1), takeUntil(this.destroy$)).subscribe((res: ProductView) => {
      const today = new Date();
      const daysTillReady = ProductViewHelper.getDeliveryDateDays(res);
      delivery = today.setDate(today.getDate() + daysTillReady);

      if (this.checkIfWeekend(new Date(delivery))) {
        delivery = this.setToClosestMonday(new Date(delivery));
      }
    });

    return delivery;
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
    if (fullDD === selectedDD || selectedDD > fullDD) {
      this.modalDeliveryText = 'camfil.modal.checkout.full-delivery.title';
      this.updateBucketDeliveryDate(false, selectedDD);
    } else {
      this.modalDeliveryText = 'camfil.modal.checkout.partial-delivery.title';
      this.updateBucketDeliveryDate(true, selectedDD);
    }
  }

  openSuccessModal() {
    this.dialog.open(this.modal?.show());
    this.modal.hide = () => this.dialog.closeAll();
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
    this.dialog.open(this.modal?.show());

    this.modal.hide = () => {
      this.dialog.closeAll();
    };

    /* Call funtion after dialog is closed either by click, backdrop click, or ESC press */
    this.dialog.afterAllClosed.pipe(first()).subscribe(() => {
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

  doubleArticlesQuantity(order) {
    order.lineItems?.forEach(item => {
      this.updateBasketItem({ itemId: item.id, quantity: item.quantity.value * 2 });
    });
  }

  updateBasketItem(formValue: LineItemUpdate) {
    this.checkoutFacade.updateBasketItem(formValue);
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
}
