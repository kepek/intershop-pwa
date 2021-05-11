import { createReducer, on } from '@ngrx/store';

import { AddressHelper } from 'ish-core/models/address/address.helper';
import { Address } from 'ish-core/models/address/address.model';
import { BasketInfo } from 'ish-core/models/basket-info/basket-info.model';
import { BasketValidationResultType } from 'ish-core/models/basket-validation/basket-validation.model';
import { Basket } from 'ish-core/models/basket/basket.model';
import { Bucket } from 'ish-core/models/basket/bucket.model';
import { CustomerDeliveryTerm } from 'ish-core/models/customer/customer.interface';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { LineItemView } from 'ish-core/models/line-item/line-item.model';
import { PaymentMethod } from 'ish-core/models/payment-method/payment-method.model';
import { ShippingMethod } from 'ish-core/models/shipping-method/shipping-method.model';
import { createOrderSuccess } from 'ish-core/store/customer/orders';
import { setErrorOn, setLoadingOn, unsetLoadingAndErrorOn } from 'ish-core/utils/ngrx-creators';

import {
  addBasketItemAttributesSuccess,
  addEmptyBucket,
  addItemsToBasket,
  addItemsToBasketFail,
  addItemsToBasketFromCamCard,
  addItemsToBasketSuccess,
  addProductToBasket,
  addProductToBucketAddressFromCamCardFail,
  addProductsFromCamCard,
  addProductsFromCamCardFail,
  addProductsToBasketFromCamCard,
  addPromotionCodeToBasket,
  addPromotionCodeToBasketFail,
  addPromotionCodeToBasketSuccess,
  assignBasketAddress,
  camfilDragLineItem,
  camfilDragLineItemFail,
  camfilDragLineItemSuccess,
  continueCheckout,
  continueCheckoutFail,
  continueCheckoutSuccess,
  continueCheckoutWithIssues,
  createBasketPayment,
  createBasketPaymentFail,
  createBasketPaymentSuccess,
  deleteBasketAttribute,
  deleteBasketAttributeFail,
  deleteBasketAttributeSuccess,
  deleteBasketItem,
  deleteBasketItemAttributesSuccess,
  deleteBasketItemFail,
  deleteBasketItemSuccess,
  deleteBasketPayment,
  deleteBasketPaymentFail,
  deleteBasketPaymentSuccess,
  deleteEmptyBucket,
  getWarehouseCalendarSuccess,
  loadBasket,
  loadBasketAddressesSuccess,
  loadBasketEligiblePaymentMethods,
  loadBasketEligiblePaymentMethodsFail,
  loadBasketEligiblePaymentMethodsSuccess,
  loadBasketEligibleShippingMethods,
  loadBasketEligibleShippingMethodsFail,
  loadBasketEligibleShippingMethodsSuccess,
  loadBasketFail,
  loadBasketSuccess,
  loadBucketsFail,
  loadBucketsSuccess,
  loadCustomerDeliveryTermSuccess,
  mergeBasketFail,
  mergeBasketSuccess,
  removePromotionCodeFromBasket,
  removePromotionCodeFromBasketFail,
  removePromotionCodeFromBasketSuccess,
  resetBasketErrors,
  resetProductAdded,
  setBasketAttribute,
  setBasketAttributeFail,
  setBasketAttributeSuccess,
  setBasketPayment,
  setBasketPaymentFail,
  setBasketPaymentSuccess,
  startCheckout,
  startCheckoutFail,
  startCheckoutSuccess,
  submitBasket,
  submitBasketFail,
  submitBasketSuccess,
  updateBasket,
  updateBasketExternalOrderReference,
  updateBasketFail,
  updateBasketItemAttributesSuccess,
  updateBasketItems,
  updateBasketItemsFail,
  updateBasketItemsSuccess,
  updateBasketPayment,
  updateBasketPaymentFail,
  updateBasketPaymentSuccess,
  updateBasketShippingMethod,
  updateBucketFail,
  updateConcardisCvcLastUpdated,
  updateConcardisCvcLastUpdatedFail,
  updateConcardisCvcLastUpdatedSuccess,
  updateEmptyBucket,
} from './basket.actions';

export interface BasketState {
  basket: Basket;
  eligibleShippingMethods: ShippingMethod[];
  eligiblePaymentMethods: PaymentMethod[];
  loading: boolean;
  promotionError: HttpError; // for promotion-errors
  error: HttpError; // add, update and delete errors
  info: BasketInfo[];
  lastTimeProductAdded: number;
  validationResults: BasketValidationResultType;
  submittedBasket: Basket;
  // TODO: CAMFIL Additions, it should be separated to avoid core modifications;
  productAdded: boolean;
  buckets: Bucket[];
  emptyBuckets: Bucket[];
  productUpdated: boolean;
  basketAddresses: Address[];
  deliveryTerms: {
    [customerId: string]: CustomerDeliveryTerm;
  };
  calendarExceptions: [];
}

const initialValidationResults: BasketValidationResultType = {
  valid: undefined,
  adjusted: undefined,
  errors: [],
};

export const initialState: BasketState = {
  basket: undefined,
  eligibleShippingMethods: undefined,
  eligiblePaymentMethods: undefined,
  loading: false,
  error: undefined,
  info: undefined,
  promotionError: undefined,
  lastTimeProductAdded: undefined,
  validationResults: initialValidationResults,
  submittedBasket: undefined,
  // TODO: CAMFIL Additions, it should be separated to avoid core modifications;
  buckets: undefined,
  productAdded: false,
  emptyBuckets: [],
  productUpdated: false,
  basketAddresses: [],
  deliveryTerms: {},
  calendarExceptions: [],
};

export const basketReducer = createReducer(
  initialState,
  setLoadingOn(
    loadBasket,
    assignBasketAddress,
    updateBasketShippingMethod,
    updateBasketExternalOrderReference,
    updateBasket,
    addProductToBasket,
    addProductsToBasketFromCamCard,
    addPromotionCodeToBasket,
    removePromotionCodeFromBasket,
    addItemsToBasket,
    continueCheckout,
    updateBasketItems,
    deleteBasketItem,
    setBasketAttribute,
    deleteBasketAttribute,
    loadBasketEligibleShippingMethods,
    loadBasketEligiblePaymentMethods,
    setBasketPayment,
    createBasketPayment,
    updateBasketPayment,
    deleteBasketPayment,
    submitBasket,
    updateConcardisCvcLastUpdated,
    startCheckout
  ),
  unsetLoadingAndErrorOn(
    loadBasketSuccess,
    mergeBasketSuccess,
    updateBasketItemsSuccess,
    deleteBasketItemSuccess,
    addItemsToBasketSuccess,
    setBasketPaymentSuccess,
    createBasketPaymentSuccess,
    updateBasketPaymentSuccess,
    deleteBasketPaymentSuccess,
    removePromotionCodeFromBasketSuccess,
    continueCheckoutSuccess,
    continueCheckoutWithIssues,
    loadBasketEligibleShippingMethodsSuccess,
    loadBasketEligiblePaymentMethodsSuccess,
    updateConcardisCvcLastUpdatedSuccess,
    submitBasketSuccess,
    startCheckoutSuccess,
    updateConcardisCvcLastUpdated,
    camfilDragLineItem,
    loadCustomerDeliveryTermSuccess
  ),
  setErrorOn(
    mergeBasketFail,
    loadBasketFail,
    loadBucketsFail,
    updateBasketFail,
    updateBucketFail,
    continueCheckoutFail,
    addItemsToBasketFail,
    removePromotionCodeFromBasketFail,
    updateBasketItemsFail,
    deleteBasketItemFail,
    setBasketAttributeFail,
    deleteBasketAttributeFail,
    loadBasketEligibleShippingMethodsFail,
    loadBasketEligiblePaymentMethodsFail,
    setBasketPaymentFail,
    createBasketPaymentFail,
    updateBasketPaymentFail,
    deleteBasketPaymentFail,
    updateConcardisCvcLastUpdatedFail,
    submitBasketFail,
    startCheckoutFail,
    camfilDragLineItemFail,
    addProductToBucketAddressFromCamCardFail,
    addProductsFromCamCardFail
  ),

  on(updateBasketItemsSuccess, deleteBasketItemSuccess, (state: BasketState, action) => ({
    ...state,
    info: action.payload.info,
    validationResults: initialValidationResults,
  })),
  on(loadBucketsSuccess, (state: BasketState, action) => {
    const addresses = action.payload.buckets.map(bucket => bucket.shipToAddressFull);
    const onlyEmpty = state.emptyBuckets.filter(emptyBucket =>
      AddressHelper.isNewAddress(emptyBucket.shipToAddressFull as Address, addresses)
    );

    return {
      ...state,
      buckets: action.payload.buckets,
      emptyBuckets: onlyEmpty,
    };
  }),
  on(addEmptyBucket, (state: BasketState, action) => ({
    ...state,
    emptyBuckets: [action.payload.bucket, ...state.emptyBuckets],
  })),
  on(deleteEmptyBucket, (state: BasketState, action) => ({
    ...state,
    emptyBuckets: state.emptyBuckets.reduce((acc, cur) => {
      if (cur.id !== action.payload.id) {
        acc.push(cur);
      }
      return acc;
    }, []),
  })),
  on(updateEmptyBucket, (state: BasketState, action) => ({
    ...state,
    emptyBuckets: state.emptyBuckets.map(bucket => {
      if (bucket.id === action.payload.bucket.id) {
        return action.payload.bucket;
      }
      return bucket;
    }),
  })),
  on(loadCustomerDeliveryTermSuccess, (state: BasketState, action) => ({
    ...state,
    deliveryTerms: {
      ...state.deliveryTerms,
      [action.payload.customerId]: action.payload.term,
    },
  })),
  on(
    setBasketPaymentSuccess,
    createBasketPaymentSuccess,
    updateBasketPaymentSuccess,
    deleteBasketPaymentSuccess,
    removePromotionCodeFromBasketSuccess,
    setBasketAttributeSuccess,
    deleteBasketAttributeSuccess,
    (state: BasketState) => ({
      ...state,
      validationResults: initialValidationResults,
    })
  ),
  on(addItemsToBasket, addItemsToBasketFromCamCard, addProductsFromCamCard, (state: BasketState) => ({
    ...state,
    productUpdated: false,
    productAdded: false,
  })),
  on(addItemsToBasketSuccess, (state: BasketState, action) => ({
    ...state,
    info: action.payload.info,
    lastTimeProductAdded: new Date().getTime(),
    submittedBasket: undefined,
    loading: false,
    error: undefined,
    productAdded: true,
    productUpdated: true,
  })),
  on(resetProductAdded, (state: BasketState) => ({
    ...state,
    productAdded: false,
  })),
  on(mergeBasketSuccess, loadBasketSuccess, (state: BasketState, action) => {
    const basket = {
      ...action.payload.basket,
    };

    return {
      ...state,
      basket,
      loading: false,
      error: undefined,
      submittedBasket: undefined,
    };
  }),
  on(startCheckoutSuccess, continueCheckoutSuccess, continueCheckoutWithIssues, (state: BasketState, action) => {
    const validation = action.payload.basketValidation;
    const basket = validation && validation.results.adjusted && validation.basket ? validation.basket : state.basket;

    return {
      ...state,
      basket,
      info: undefined,
      submittedBasket: undefined,
      validationResults: validation && validation.results,
    };
  }),
  on(loadBasketEligibleShippingMethodsSuccess, (state: BasketState, action) => ({
    ...state,
    eligibleShippingMethods: action.payload.shippingMethods,
  })),
  on(loadBasketEligiblePaymentMethodsSuccess, (state: BasketState, action) => ({
    ...state,
    eligiblePaymentMethods: action.payload.paymentMethods,
  })),
  on(updateConcardisCvcLastUpdatedSuccess, (state: BasketState, action) => ({
    ...state,
    basket: {
      ...state.basket,
      payment: {
        ...state.basket.payment,
        paymentInstrument: action.payload.paymentInstrument,
      },
    },
  })),
  on(addPromotionCodeToBasketSuccess, (state: BasketState) => ({
    ...state,
    loading: false,
    promotionError: undefined,
  })),

  on(getWarehouseCalendarSuccess, (state: BasketState, action) => {
    const { dates } = action.payload;

    return {
      ...state,
      calendarExceptions: dates,
    };
  }),

  on(addPromotionCodeToBasketFail, (state: BasketState, action) => {
    const { error } = action.payload;

    return {
      ...state,
      promotionError: error,
      loading: false,
    };
  }),

  on(createOrderSuccess, () => initialState),
  on(submitBasketSuccess, (state: BasketState) => ({
    ...state,
    submittedBasket: state.basket,
    basket: undefined,
    info: undefined,
    promotionError: undefined,
    validationResults: initialValidationResults,
  })),

  on(resetBasketErrors, (state: BasketState) => ({
    ...state,
    error: undefined,
    info: undefined,
    promotionError: undefined,
    validationResults: initialValidationResults,
  })),

  // CAMFIL

  on(camfilDragLineItemSuccess, (state: BasketState, action) => {
    const basket = {
      ...action.payload.updatedBasket,
    };

    return {
      ...state,
      basket,
      loading: false,
      error: undefined,
    };
  }),
  on(loadBasketAddressesSuccess, (state: BasketState, action) => ({
    ...state,
    basketAddresses: action.payload.basketAddresses,
  })),
  on(updateBasketItemAttributesSuccess, addBasketItemAttributesSuccess, (state: BasketState, action) => {
    const { bucketId, lineItemId, attribute } = action.payload;
    const lineItems = state.basket.lineItems.map(li =>
      li.id === lineItemId
        ? {
            ...li,
            attributes: li.attributes.find(att => att.name === attribute.name)
              ? li.attributes.map(att => (att.name === attribute.name ? attribute : att))
              : [...li.attributes, attribute],
          }
        : li
    );
    return {
      ...state,
      basket: {
        ...state.basket,
        lineItems,
      },
      buckets: state.buckets.map(b =>
        b.id === bucketId
          ? {
              ...b,
              lineItems,
            }
          : b
      ),
    };
  }),
  on(deleteBasketItemAttributesSuccess, (state: BasketState, action) => {
    const { bucketId, lineItemId, attributeName } = action.payload;
    const filteredItems = (items: LineItemView[]) =>
      items?.map(li =>
        li.id === lineItemId
          ? {
              ...li,
              attributes: li.attributes.filter(att => att.name !== attributeName),
            }
          : li
      );
    return {
      ...state,
      basket: {
        ...state.basket,
        lineItems: filteredItems(state.basket.lineItems),
      },
      buckets: state.buckets.map(b =>
        b.id === bucketId
          ? {
              ...b,
              lineItems: filteredItems(b.lineItems),
            }
          : b
      ),
    };
  })
);
