import { createReducer, on } from '@ngrx/store';

import { BasketInfo } from 'ish-core/models/basket-info/basket-info.model';
import { BasketValidationResultType } from 'ish-core/models/basket-validation/basket-validation.model';
import { Basket } from 'ish-core/models/basket/basket.model';
import { Bucket } from 'ish-core/models/basket/bucket.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { PaymentMethod } from 'ish-core/models/payment-method/payment-method.model';
import { ShippingMethod } from 'ish-core/models/shipping-method/shipping-method.model';
import { createOrderSuccess } from 'ish-core/store/customer/orders';
import { setErrorOn, setLoadingOn } from 'ish-core/utils/ngrx-creators';

import {
  addEmptyBucket,
  addItemsToBasket,
  addItemsToBasketFail,
  addItemsToBasketSuccess,
  addProductToBasket,
  addPromotionCodeToBasket,
  addPromotionCodeToBasketFail,
  addPromotionCodeToBasketSuccess,
  assignBasketAddress,
  continueCheckout,
  continueCheckoutFail,
  continueCheckoutSuccess,
  continueCheckoutWithIssues,
  createBasketPayment,
  createBasketPaymentFail,
  createBasketPaymentSuccess,
  deleteBasketItem,
  deleteBasketItemFail,
  deleteBasketItemSuccess,
  deleteBasketPayment,
  deleteBasketPaymentFail,
  deleteBasketPaymentSuccess,
  loadBasket,
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
  mergeBasketFail,
  mergeBasketSuccess,
  removePromotionCodeFromBasket,
  removePromotionCodeFromBasketFail,
  removePromotionCodeFromBasketSuccess,
  resetBasketErrors,
  resetProductAdded,
  setBasketPayment,
  setBasketPaymentFail,
  setBasketPaymentSuccess,
  updateBasket,
  updateBasketFail,
  updateBasketItems,
  updateBasketItemsFail,
  updateBasketItemsSuccess,
  updateBasketPayment,
  updateBasketPaymentFail,
  updateBasketPaymentSuccess,
  updateBasketShippingMethod,
  updateBucketFail,
  updateBucketSuccess,
  updateConcardisCvcLastUpdated,
  updateConcardisCvcLastUpdatedFail,
  updateConcardisCvcLastUpdatedSuccess,
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
  productAdded: boolean;
  buckets: Bucket[];
  emptyBuckets: Bucket[];
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
  buckets: undefined,
  productAdded: false,
  emptyBuckets: [],
};

export const basketReducer = createReducer(
  initialState,
  setLoadingOn(
    loadBasket,
    assignBasketAddress,
    updateBasketShippingMethod,
    updateBasket,
    addProductToBasket,
    addPromotionCodeToBasket,
    removePromotionCodeFromBasket,
    addItemsToBasket,
    continueCheckout,
    updateBasketItems,
    deleteBasketItem,
    loadBasketEligibleShippingMethods,
    loadBasketEligiblePaymentMethods,
    setBasketPayment,
    createBasketPayment,
    updateBasketPayment,
    deleteBasketPayment,
    updateConcardisCvcLastUpdated
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
    loadBasketEligibleShippingMethodsFail,
    loadBasketEligiblePaymentMethodsFail,
    setBasketPaymentFail,
    createBasketPaymentFail,
    updateBasketPaymentFail,
    deleteBasketPaymentFail,
    updateConcardisCvcLastUpdatedFail
  ),
  on(addPromotionCodeToBasketFail, (state: BasketState, action) => {
    const { error } = action.payload;

    return {
      ...state,
      promotionError: error,
      loading: false,
    };
  }),
  on(addPromotionCodeToBasketSuccess, (state: BasketState) => ({
    ...state,
    loading: false,
    promotionError: undefined,
  })),
  on(updateBasketItemsSuccess, deleteBasketItemSuccess, (state: BasketState, action) => ({
    ...state,
    loading: false,
    error: undefined,
    info: action.payload.info,
    validationResults: initialValidationResults,
  })),
  on(loadBucketsSuccess, (state: BasketState, action) => ({
    ...state,
    buckets: action.payload.buckets,
  })),
  on(addEmptyBucket, (state: BasketState, action) => ({
    ...state,
    emptyBuckets: [action.payload.bucket, ...state.emptyBuckets],
  })),
  on(updateBucketSuccess, (state: BasketState) => ({
    ...state,
    productAdded: true,
  })),
  on(
    removePromotionCodeFromBasketSuccess,
    setBasketPaymentSuccess,
    createBasketPaymentSuccess,
    updateBasketPaymentSuccess,
    deleteBasketPaymentSuccess,
    (state: BasketState) => ({
      ...state,
      loading: false,
      error: undefined,
      validationResults: initialValidationResults,
    })
  ),
  on(addItemsToBasketSuccess, (state: BasketState, action) => ({
    ...state,
    loading: false,
    error: undefined,
    info: action.payload.info,
    lastTimeProductAdded: new Date().getTime(),
    productAdded: true,
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
    };
  }),
  on(continueCheckoutSuccess, continueCheckoutWithIssues, (state: BasketState, action) => {
    const validation = action.payload.basketValidation;
    const basket = validation && validation.results.adjusted && validation.basket ? validation.basket : state.basket;

    return {
      ...state,
      basket,
      loading: false,
      error: undefined,
      info: undefined,
      validationResults: validation && validation.results,
    };
  }),
  on(loadBasketEligibleShippingMethodsSuccess, (state: BasketState, action) => ({
    ...state,
    eligibleShippingMethods: action.payload.shippingMethods,
    loading: false,
    error: undefined,
  })),
  on(loadBasketEligiblePaymentMethodsSuccess, (state: BasketState, action) => ({
    ...state,
    eligiblePaymentMethods: action.payload.paymentMethods,
    loading: false,
    error: undefined,
  })),
  on(createOrderSuccess, () => initialState),
  on(resetBasketErrors, (state: BasketState) => ({
    ...state,
    error: undefined,
    info: undefined,
    promotionError: undefined,
    validationResults: initialValidationResults,
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
    loading: false,
    error: undefined,
  }))
);
