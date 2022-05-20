import { Injectable } from '@angular/core';
import { Store, createSelector, select } from '@ngrx/store';
import { getBucketGoodsAcceptanceNote } from 'camfil-pwa/store/customer/ish-basket/ish-basket-addresses.selectors';
import { merge } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';

import { Address } from 'ish-core/models/address/address.model';
import { Attribute } from 'ish-core/models/attribute/attribute.model';
import { BasketValidationScopeType } from 'ish-core/models/basket-validation/basket-validation.model';
import { Bucket } from 'ish-core/models/bucket/bucket.model';
import { LineItemUpdate } from 'ish-core/models/line-item-update/line-item-update.model';
import { LineItem } from 'ish-core/models/line-item/line-item.model';
import { PaymentInstrument } from 'ish-core/models/payment-instrument/payment-instrument.model';
import { selectRouteData } from 'ish-core/store/core/router';
import { getFocusedCheckoutElement } from 'ish-core/store/core/viewconf/viewconf.selectors';
import { getAllAddresses } from 'ish-core/store/customer/addresses';
import {
  addBasketItemAttributes,
  addEmptyBucket,
  addPromotionCodeToBasket,
  assignBasketAddress,
  camfilDragLineItem,
  checkCurrentBasket,
  continueCheckout,
  createBasketAddress,
  createBasketPayment,
  deleteBasketAttribute,
  deleteBasketItem,
  deleteBasketItemAttributes,
  deleteBasketPayment,
  deleteBasketShippingAddress,
  deleteBucket,
  deleteEmptyBucket,
  doubleBucketItemsQuantity,
  focusedCheckoutElement,
  getAllBuckets,
  getAnonymousBasketExtensions,
  getBasketEligiblePaymentMethods,
  getBasketEligibleShippingMethods,
  getBasketError,
  getBasketInfo,
  getBasketInvoiceAddress,
  getBasketLastTimeProductAdded,
  getBasketLoading,
  getBasketPromotionError,
  getBasketShippingAddress,
  getBasketValidationResults,
  getBucketEmailRecipients,
  getBucketsVolumeDiscounts,
  getCalendarExceptions,
  getCurrentBasket,
  getCurrentBuckets,
  getCustomersDeliveryTerms,
  getEmptyBuckets,
  getSubmittedAnonymousBasketExtensions,
  getSubmittedBasket,
  getSubmittedBuckets,
  getWarehouseCalendar,
  isBasketInvoiceAndShippingAddressEqual,
  loadBasketEligiblePaymentMethods,
  loadBasketEligibleShippingMethods,
  loadBuckets,
  loadCustomerDeliveryTerm,
  removePromotionCodeFromBasket,
  setBasketAttribute,
  setBasketOrderType,
  setBasketPayment,
  setBucketScrollIndex,
  startCheckout,
  updateBasketAddress,
  updateBasketItemAttributes,
  updateBasketItems,
  updateBasketShippingMethod,
  updateConcardisCvcLastUpdated,
  updateEmptyBucket,
  validateBasket,
} from 'ish-core/store/customer/basket';
import { getOrdersError, getOrdersLoading, getSelectedOrder } from 'ish-core/store/customer/orders';
import { getLoggedInUser } from 'ish-core/store/customer/user';
import { getServerConfigParameter } from 'ish-core/store/general/server-config';
import { whenTruthy } from 'ish-core/utils/operators';

// tslint:disable:member-ordering
@Injectable({ providedIn: 'root' })
export class CheckoutFacade {
  checkoutStep$ = this.store.pipe(select(selectRouteData<number>('checkoutStep')));
  basket$ = this.store.pipe(select(getCurrentBasket));
  basketChange$ = this.store.pipe(select(getBasketLastTimeProductAdded));
  basketError$ = this.store.pipe(select(getBasketError));
  basketInfo$ = this.store.pipe(select(getBasketInfo));

  // BASKET
  basketLoading$ = this.store.pipe(select(getBasketLoading));
  basketValidationResults$ = this.store.pipe(select(getBasketValidationResults));
  basketItemCount$ = this.basket$.pipe(map(basket => (basket && basket.totalProductQuantity) || 0));
  basketItemTotal$ = this.basket$.pipe(map(basket => basket && basket.totals && basket.totals.itemTotal));
  basketLineItems$ = this.basket$.pipe(
    map(basket => (basket && basket.lineItems && basket.lineItems.length ? basket.lineItems : undefined))
  );
  basketOrderType$ = this.store.pipe(select(getBasketLoading));
  submittedBasket$ = this.store.pipe(select(getSubmittedBasket));
  submittedBuckets$ = this.store.pipe(select(getSubmittedBuckets));
  calendarExceptions$ = this.store.pipe(select(getCalendarExceptions));
  getFocusedCheckoutElement$ = this.store.pipe(select(getFocusedCheckoutElement));
  selectedOrder$ = this.store.pipe(select(getSelectedOrder));
  ordersLoading$ = this.store.pipe(select(getOrdersLoading));
  priceType$ = this.store.pipe(select(getServerConfigParameter<'gross' | 'net'>('pricing.priceType')));
  basketInvoiceAddress$ = this.store.pipe(select(getBasketInvoiceAddress));
  basketShippingAddress$ = this.store.pipe(select(getBasketShippingAddress));
  basketInvoiceAndShippingAddressEqual$ = this.store.pipe(select(isBasketInvoiceAndShippingAddressEqual));
  basketShippingAddressDeletable$ = this.store.pipe(
    select(
      createSelector(
        getLoggedInUser,
        getAllAddresses,
        getBasketShippingAddress,
        (user, addresses, shippingAddress): boolean =>
          !!shippingAddress &&
          !!user &&
          addresses.length > 1 &&
          (!user.preferredInvoiceToAddressUrn || user.preferredInvoiceToAddressUrn !== shippingAddress.urn) &&
          (!user.preferredShipToAddressUrn || user.preferredShipToAddressUrn !== shippingAddress.urn)
      )
    )
  );
  promotionError$ = this.store.pipe(select(getBasketPromotionError));
  buckets$ = this.store.pipe(select(getCurrentBuckets));
  emptyBuckets$ = this.store.pipe(select(getEmptyBuckets));
  allBuckets$ = this.store.pipe(select(getAllBuckets));
  bucketsVolumeDiscounts$ = this.store.pipe(select(getBucketsVolumeDiscounts));
  getCustomersDeliveryTerms$ = this.store.pipe(select(getCustomersDeliveryTerms));
  anonymousBasketExtension$ = this.store.pipe(select(getAnonymousBasketExtensions));
  submittedAnonymousBasketExtension$ = this.store.pipe(select(getSubmittedAnonymousBasketExtensions));

  // ORDERS
  private ordersError$ = this.store.pipe(select(getOrdersError));
  basketOrOrdersError$ = merge(this.basketError$, this.ordersError$);

  constructor(protected store: Store) {}

  start() {
    this.store.dispatch(startCheckout());
  }

  // SHIPPING

  continue(targetStep: number) {
    this.store.dispatch(continueCheckout({ targetStep }));
  }

  // PAYMENT

  validate(scopes: BasketValidationScopeType[]) {
    this.store.dispatch(validateBasket({ scopes }));
  }

  getBucketEmailRecipients$(urn: string) {
    return this.store.pipe(select(getBucketEmailRecipients(urn)));
  }

  deleteBasketItem(itemId: string) {
    this.store.dispatch(deleteBasketItem({ itemId }));
  }

  updateBasketItem(update: LineItemUpdate) {
    this.store.dispatch(updateBasketItems({ lineItemUpdates: [update] }));
  }

  updateBasketShippingMethod(shippingId: string) {
    this.store.dispatch(updateBasketShippingMethod({ shippingId }));
  }

  // ADDRESSES

  setBasketCustomAttribute(attribute: Attribute): void {
    this.store.dispatch(setBasketAttribute({ attribute }));
  }

  deleteBasketCustomAttribute(attributeName: string): void {
    this.store.dispatch(deleteBasketAttribute({ attributeName }));
  }

  checkCurrentBasket() {
    this.store.dispatch(checkCurrentBasket());
  }

  eligibleShippingMethods$() {
    return this.basketLineItems$.pipe(
      whenTruthy(),
      take(1),
      tap(() => this.store.dispatch(loadBasketEligibleShippingMethods())),
      switchMap(() => this.store.pipe(select(getBasketEligibleShippingMethods)))
    );
  }

  eligiblePaymentMethods$() {
    return this.basketLineItems$.pipe(
      whenTruthy(),
      take(1),
      tap(() => this.store.dispatch(loadBasketEligiblePaymentMethods())),
      switchMap(() => this.store.pipe(select(getBasketEligiblePaymentMethods)))
    );
  }

  setBasketPayment(paymentName: string) {
    this.store.dispatch(setBasketPayment({ id: paymentName }));
  }

  createBasketPayment(paymentInstrument: PaymentInstrument, saveForLater = false) {
    this.store.dispatch(createBasketPayment({ paymentInstrument, saveForLater }));
  }

  // PROMOTIONS

  deleteBasketPayment(paymentInstrument: PaymentInstrument) {
    this.store.dispatch(deleteBasketPayment({ paymentInstrument }));
  }

  assignBasketAddress(addressId: string, scope: 'invoice' | 'shipping' | 'any') {
    this.store.dispatch(assignBasketAddress({ addressId, scope }));
  }

  createBasketAddress(address: Address, scope: 'invoice' | 'shipping' | 'any') {
    if (!address || !scope) {
      return;
    }

    this.store.dispatch(createBasketAddress({ address, scope }));
  }

  updateBasketAddress(address: Address) {
    this.store.dispatch(updateBasketAddress({ address }));
  }

  // TODO: CAMFIL Additions, it should be separated to avoid core modifications;

  deleteBasketAddress(addressId: string) {
    this.store.dispatch(deleteBasketShippingAddress({ addressId }));
  }

  addPromotionCodeToBasket(code: string) {
    this.store.dispatch(addPromotionCodeToBasket({ code }));
  }

  removePromotionCodeFromBasket(code: string) {
    this.store.dispatch(removePromotionCodeFromBasket({ code }));
  }

  updateConcardisCvcLastUpdated(paymentInstrument: PaymentInstrument) {
    this.store.dispatch(updateConcardisCvcLastUpdated({ paymentInstrument }));
  }

  loadBuckets() {
    this.store.dispatch(loadBuckets());
  }

  addEmptyBucket(emptyBucket: Bucket) {
    this.store.dispatch(addEmptyBucket({ bucket: emptyBucket }));
  }

  updateEmptyBucket(emptyBucket: Bucket) {
    this.store.dispatch(
      updateEmptyBucket({
        bucket: emptyBucket,
      })
    );
  }

  deleteEmptyBucket(id: string) {
    this.store.dispatch(deleteEmptyBucket({ id }));
  }

  camfilDragLineItem(basketId: string, updatedLineItem: LineItem, targetBucket: Bucket) {
    this.store.dispatch(camfilDragLineItem({ basketId, updatedLineItem, targetBucket }));
  }

  addBasketItemAttributes(basketId: string, lineItemId: string, bucketId: string, lineItemAttribute: Attribute) {
    this.store.dispatch(addBasketItemAttributes({ basketId, lineItemId, bucketId, lineItemAttribute }));
  }

  deleteBasketItemAttributes(basketId: string, lineItemId: string, bucketId: string, attributeName: string) {
    this.store.dispatch(deleteBasketItemAttributes({ basketId, lineItemId, bucketId, attributeName }));
  }

  updateBasketItemAttributes(basketId: string, lineItemId: string, bucketId: string, lineItemAttribute: Attribute) {
    this.store.dispatch(updateBasketItemAttributes({ basketId, lineItemId, bucketId, lineItemAttribute }));
  }

  deleteOrder(basketId: string, bucketId: string) {
    this.store.dispatch(deleteBucket({ basketId, bucketId }));
  }

  loadCustomerDeliveryTerm(customerId: string) {
    this.store.dispatch(loadCustomerDeliveryTerm({ customerId }));
  }

  getWarehouseCalendar() {
    this.store.dispatch(getWarehouseCalendar());
  }

  setCheckoutFocusedElement(elementId: string) {
    this.store.dispatch(focusedCheckoutElement({ elementId }));
  }

  updateBasketItems(lineItemUpdates: LineItemUpdate[]) {
    this.store.dispatch(updateBasketItems({ lineItemUpdates }));
  }

  doubleBucketItemsQuantity(basketId: string, bucketId: string) {
    this.store.dispatch(doubleBucketItemsQuantity({ basketId, bucketId }));
  }

  setBucketScrollIndex(urn: string, index: number) {
    this.store.dispatch(setBucketScrollIndex({ urn, index }));
  }

  setBasketOrderType(orderType?: string) {
    this.store.dispatch(setBasketOrderType({ orderType }));
  }

  getBucketGoodsAcceptanceNote$(urn: string) {
    return this.store.pipe(select(getBucketGoodsAcceptanceNote(urn)));
  }
}
