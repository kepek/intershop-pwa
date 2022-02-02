import { createReducer, on } from '@ngrx/store';

import { AddressHelper } from 'ish-core/models/address/address.helper';
import { Address } from 'ish-core/models/address/address.model';
import { BasketInfo } from 'ish-core/models/basket-info/basket-info.model';
import { BasketValidationResultType } from 'ish-core/models/basket-validation/basket-validation.model';
import { Basket } from 'ish-core/models/basket/basket.model';
import { Bucket } from 'ish-core/models/bucket/bucket.model';
import { CustomerDeliveryTerm } from 'ish-core/models/customer/customer.interface';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { LineItemView } from 'ish-core/models/line-item/line-item.model';
import { PaymentMethod } from 'ish-core/models/payment-method/payment-method.model';
import { ShippingMethod } from 'ish-core/models/shipping-method/shipping-method.model';
import { createOrderSuccess } from 'ish-core/store/customer/orders';
import { setErrorOn, setLoadingOn, unsetLoadingAndErrorOn } from 'ish-core/utils/ngrx-creators';

import {
  addBasketItemAttributes,
  addBasketItemAttributesFail,
  addBasketItemAttributesSuccess,
  addEmptyBucket,
  addItemsToBasket,
  addItemsToBasketFail,
  addItemsToBasketFromCamCard,
  addItemsToBasketFromCamCardFail,
  addItemsToBasketFromCamCardSuccess,
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
  deleteBasketItemAttributes,
  deleteBasketItemAttributesSuccess,
  deleteBasketItemFail,
  deleteBasketItemSuccess,
  deleteBasketPayment,
  deleteBasketPaymentFail,
  deleteBasketPaymentSuccess,
  deleteBucket,
  deleteBucketFail,
  deleteBucketSuccess,
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
  loadBuckets,
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
  setBucketScrollIndex,
  startCheckout,
  startCheckoutFail,
  startCheckoutSuccess,
  submitBasket,
  submitBasketFail,
  submitBasketSuccess,
  updateBasket,
  updateBasketExternalOrderReference,
  updateBasketFail,
  updateBasketItemAttributes,
  updateBasketItemAttributesSuccess,
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
  updateEmptyBucket,
} from './basket.actions';

import { createRequisitionSuccess } from '../../../../extensions/cam-requisition-management/store/requisitions/requisitions.actions';

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
  submittedBuckets: Bucket[];
  emptyBuckets: Bucket[];
  productUpdated: boolean;
  basketAddresses: Address[];
  deliveryTerms: {
    [customerId: string]: CustomerDeliveryTerm;
  };
  calendarExceptions: [];
  failedCamCardName: string;
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
  failedCamCardName: undefined,
  info: undefined,
  promotionError: undefined,
  lastTimeProductAdded: undefined,
  validationResults: initialValidationResults,
  submittedBasket: undefined,
  // TODO: CAMFIL Additions, it should be separated to avoid core modifications;
  buckets: undefined,
  submittedBuckets: undefined,
  productAdded: false,
  emptyBuckets: undefined,
  productUpdated: false,
  basketAddresses: [],
  deliveryTerms: {},
  calendarExceptions: [],
};

export const basketReducer = createReducer(
  initialState,
  setLoadingOn(
    loadBasket,
    loadBuckets,
    deleteBucket,
    assignBasketAddress,
    updateBasketShippingMethod,
    updateBasketExternalOrderReference,
    updateBasket,
    addBasketItemAttributes,
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
    startCheckout,
    updateBasketItemAttributes
  ),
  unsetLoadingAndErrorOn(
    loadBasketSuccess,
    loadBucketsSuccess,
    mergeBasketSuccess,
    addBasketItemAttributesSuccess,
    updateBasketItemsSuccess,
    deleteBasketItemSuccess,
    addItemsToBasketSuccess,
    addItemsToBasketFromCamCardSuccess,
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
    loadCustomerDeliveryTermSuccess,
    deleteBucketSuccess,
    addItemsToBasketFromCamCardFail,
    updateBasketItemAttributesSuccess
  ),
  setErrorOn(
    mergeBasketFail,
    addBasketItemAttributesFail,
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
    addProductsFromCamCardFail,
    deleteBucketFail
  ),
  on(updateBasketItemAttributes, addBasketItemAttributes, deleteBasketItemAttributes, (state: BasketState) => ({
    ...state,
  })),
  on(updateBasketItems, deleteBasketItem, (state: BasketState) => ({
    ...state,
    productUpdated: false,
    productAdded: false,
    lastTimeProductAdded: state.lastTimeProductAdded || 1,
  })),
  on(updateBasketItemsFail, deleteBasketItemFail, (state: BasketState) => ({
    ...state,
    productUpdated: true,
    productAdded: true,
  })),
  on(updateBasketItemsSuccess, deleteBasketItemSuccess, (state: BasketState, action) => ({
    ...state,
    info: action.payload.info,
    validationResults: initialValidationResults,
    productUpdated: true,
    productAdded: true,
  })),
  on(loadBucketsSuccess, (state: BasketState, action) => {
    const addresses = action.payload.buckets.map(bucket => bucket.shipToAddressFull);
    const onlyEmpty = state.emptyBuckets?.filter(emptyBucket =>
      AddressHelper.isNewAddress(emptyBucket.shipToAddressFull as Address, addresses)
    );
    const buckets = action.payload.buckets?.map(b => {
      const isScrollIndex = state.buckets?.find(
        sb => sb.shipToAddress === b.shipToAddress && sb.currentScrollIndex !== undefined
      );
      return isScrollIndex ? { ...b, currentScrollIndex: isScrollIndex.currentScrollIndex } : b;
    });

    return {
      ...state,
      buckets: buckets?.length ? buckets : undefined,
      emptyBuckets: onlyEmpty,
    };
  }),
  on(addEmptyBucket, (state: BasketState, action) => {
    const emptyBuckets = [].concat(state?.emptyBuckets)?.filter(Boolean);

    return {
      ...state,
      emptyBuckets: [action.payload.bucket, ...emptyBuckets],
    };
  }),
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
    updateBucketSuccess,
    (state: BasketState) => ({
      ...state,
      validationResults: initialValidationResults,
    })
  ),
  on(addItemsToBasket, addItemsToBasketFromCamCard, addProductsFromCamCard, (state: BasketState) => ({
    ...state,
    lastTimeProductAdded: state.lastTimeProductAdded || 1,
    productUpdated: false,
    productAdded: false,
  })),
  on(addItemsToBasketSuccess, (state: BasketState, action) => ({
    ...state,
    info: action.payload.info,
    lastTimeProductAdded: new Date().getTime(),
    submittedBasket: undefined,
    submittedBuckets: undefined,
    loading: false,
    error: undefined,
    productAdded: true,
    productUpdated: true,
  })),
  on(addItemsToBasketFromCamCardSuccess, (state: BasketState) => ({
    ...state,
    lastTimeProductAdded: new Date().getTime(),
    submittedBasket: undefined,
    submittedBuckets: undefined,
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
      submittedBuckets: undefined,
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
      submittedBuckets: undefined,
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

  on(createOrderSuccess, (state: BasketState) => ({
    ...initialState,
    submittedBasket: state.basket,
    submittedBuckets: state.buckets,
  })),
  on(submitBasketSuccess, createRequisitionSuccess, (state: BasketState) => ({
    ...state,
    submittedBasket: state.basket,
    submittedBuckets: state.buckets,
    basket: undefined,
    buckets: undefined,
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
    const selectedBucket = state.buckets?.filter(b => b.id === bucketId)[0];
    const selectedBucketLinetItems = lineItems?.filter(li => selectedBucket?.lineItems.some(item => item.id === li.id));
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
              selectedBucketLinetItems,
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
  }),
  on(addItemsToBasketFromCamCardFail, (state: BasketState, action) => ({
    ...state,
    error: action.payload.error,
    failedCamCardName: action.payload.failedCamCardName,
  })),
  on(setBucketScrollIndex, (state: BasketState, action) => {
    const { urn, index } = action.payload;
    const buckets = state.buckets?.map(b => (b.shipToAddress === urn ? { ...b, currentScrollIndex: index } : b));
    return {
      ...state,
      buckets,
    };
  })
);
