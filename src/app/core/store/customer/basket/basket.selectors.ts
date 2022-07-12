import { createSelector, createSelectorFactory, defaultMemoize } from '@ngrx/store';
import { isEqual } from 'lodash-es';

import { AddressHelper } from 'ish-core/models/address/address.helper';
import { BasketValidationResultType } from 'ish-core/models/basket-validation/basket-validation.model';
import { BasketView, createBasketView } from 'ish-core/models/basket/basket.model';
import { Bucket } from 'ish-core/models/bucket/bucket.model';
import { getCustomerState } from 'ish-core/store/customer/customer-store';
import { getOrdersLoading } from 'ish-core/store/customer/orders';
import { getLoggedInCustomer } from 'ish-core/store/customer/user';

const getBasketState = createSelector(getCustomerState, state => state && state.basket);

export const getBasketValidationResults = createSelector(
  getBasketState,
  (basket): BasketValidationResultType => {
    if (!basket || !basket.validationResults) {
      return;
    }

    const basketResults = basket.validationResults;
    return {
      ...basketResults,
      infos: basketResults.infos || [],
      errors: basketResults.errors
        ? basketResults.errors.map(error => ({
            ...error,
            lineItem: error.parameters &&
              error.parameters.lineItemId && {
                ...basket.basket?.lineItems.find(item => item.id === error.parameters.lineItemId),
              },
          }))
        : [],
    };
  }
);

export const getBasketInfo = createSelector(getBasketState, basket => basket.info);

export const getBasketLineItems = createSelector(getBasketState, basket => basket.basket.lineItems);

export const getCurrentBasket = createSelector(
  getBasketState,
  getBasketValidationResults,
  getBasketInfo,
  (basket, validationResults, basketInfo): BasketView => createBasketView(basket.basket, validationResults, basketInfo)
);

export const getCurrentBasketId = createSelector(getBasketState, basket =>
  basket.basket ? basket.basket.id : undefined
);

export const getCurrentBasketOrderType = createSelector(getBasketState, basket => ({
  basket: basket.basket,
  orderType: basket.orderType,
}));

export const getSubmittedBasket = createSelector(
  getBasketState,
  getBasketValidationResults,
  getBasketInfo,
  (basket, validationResults, basketInfo): BasketView =>
    createBasketView(basket.submittedBasket, validationResults, basketInfo)
);

export const getSubmittedBasketId = createSelector(getBasketState, basket =>
  basket.submittedBasket ? basket.submittedBasket.id : undefined
);

export const getBasketLoading = createSelector(getBasketState, basket => basket.loading);

export const getBasketOrderType = createSelector(getBasketState, basket => basket.orderType);

export const getBasketError = createSelector(getBasketState, basket => basket.error);

export const getBasketPromotionError = createSelector(getBasketState, basket => basket.promotionError);

export const getBasketLastTimeProductAdded = createSelector(getBasketState, basket => basket.lastTimeProductAdded);

export const getProductAdded = createSelector(getBasketState, basket => basket.productAdded);

export const getProductUpdated = createSelector(getBasketState, basket => basket.productUpdated);

export const getBasketAddresses = createSelector(getBasketState, basket => basket.basketAddresses);

export const getCurrentBuckets = createSelector(getBasketState, basket => basket.buckets);

export const getEmptyBuckets = createSelector(getBasketState, basket => basket.emptyBuckets);

export const getAllBuckets = createSelector(getBasketState, basket => {
  const allBuckets: Bucket[] = [];

  if (basket?.emptyBuckets) {
    allBuckets.push(...basket.emptyBuckets);
  }

  if (basket?.buckets) {
    allBuckets.push(...basket.buckets);
  }

  return allBuckets?.length ? allBuckets : undefined;
});

export const getBucketDetails = createSelector(
  getAllBuckets,
  (entities: Bucket[], props: { id: string }): Bucket => props.id && entities[props.id]
);

export const getBuckets = createSelector(
  getAllBuckets,
  (entities: Bucket[], props: { ids: string[] }): Bucket[] =>
    props.ids && entities.filter(e => props.ids.includes(e.id))
);

export const getBasketEligibleShippingMethods = createSelector(
  getBasketState,
  basket => basket.eligibleShippingMethods
);

export const getBasketEligiblePaymentMethods = createSelector(
  getBasketState,
  getLoggedInCustomer,
  (basket, customer) =>
    basket &&
    basket.eligiblePaymentMethods &&
    basket.eligiblePaymentMethods.map(pm => (customer ? pm : { ...pm, saveAllowed: false }))
);

export const getBasketInvoiceAddress = createSelectorFactory(projector =>
  defaultMemoize(projector, undefined, isEqual)
)(getCurrentBasket, basket => basket && basket.invoiceToAddress);

export const getBasketShippingAddress = createSelectorFactory(projector =>
  defaultMemoize(projector, undefined, isEqual)
)(getCurrentBasket, basket => basket && basket.commonShipToAddress);

export const isBasketInvoiceAndShippingAddressEqual = createSelector(
  getBasketInvoiceAddress,
  getBasketShippingAddress,
  AddressHelper.equal
);

export const getCustomersDeliveryTerms = createSelector(getBasketState, basket => basket.deliveryTerms);

export const getCalendarExceptions = createSelector(getBasketState, basket => basket.calendarExceptions);

export const isProductsReadyToPlaceOrder = createSelector(
  getBasketLoading,
  getOrdersLoading,
  getBasketValidationResults,
  getBasketLastTimeProductAdded,
  getProductAdded,
  getProductUpdated,
  (basketLoading, ordersLoading, validation, lastAdded, added, updated) => {
    if (basketLoading || ordersLoading) {
      return false;
    }

    if (validation.valid || !validation?.errors?.length) {
      return lastAdded ? added && updated : true;
    }

    return validation.valid;
  }
);

export const getBasketExtensions = createSelector(getBasketState, basket => basket.basket.basketExtensions);

export const selectEmailRecipients = createSelector(getBasketState, basket =>
  basket.basket?.basketExtensions?.map(({ emailRecipients, shippingAddress }) => ({
    urn: shippingAddress?.id,
    emailRecipients,
  }))
);

export const getBucketEmailRecipients = (addressId: string) =>
  createSelector(
    selectEmailRecipients,
    allRecipients => allRecipients?.find(ar => ar.urn === addressId)?.emailRecipients?.filter(er => er !== '') || []
  );

export const getBucketsVolumeDiscounts = createSelector(getBasketState, state =>
  state.basket?.basketExtensions
    ?.map(be => be.volumeDiscount)
    .reduce(
      (prev, next) => ({
        type: 'Money',
        currency: state?.basket?.purchaseCurrency,
        value: prev?.value + next?.value,
      }),
      {
        type: 'Money',
        currency: 'N/A',
        value: 0,
      }
    )
);

export const getProductAddingError = createSelector(getBasketState, basket => basket.error);

export const getFailedCamCardName = createSelector(getBasketState, basket => basket.failedCamCardName);

export const getAnonymousBasketExtensions = createSelector(
  getBasketState,
  /* tslint:disable:no-string-literal */
  basket => basket.basket?.basketExtensions?.[0]?.guestBasket
);

export const getSubmittedAnonymousBasketExtensions = createSelector(
  getBasketState,
  /* tslint:disable:no-string-literal */
  basket => basket.submittedBasket?.basketExtensions?.[0]?.guestBasket
);

export const getSubmittedBuckets = createSelector(getBasketState, basket => basket.submittedBuckets);
