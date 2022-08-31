import channelConfig from 'camfil-pwa/settings';

import { BasketSurchargeTypes } from 'ish-core/models/basket-surcharge/basket-surcharge.types';

export type CamfilChannelCode = keyof typeof channelConfig;

export type CamfilCurrency = 'EUR' | 'SEK' | 'CHF';

export type CamfilLang = 'de_AT' | 'de_CH' | 'de_DE' | 'en_GB' | 'fi_FI' | 'fr_FR' | 'it_IT' | 'sv_SE';

export type CamfilChannelSetting = CamfilChannelCode | keyof CamfilChannelSettings;

export interface CamfilChannelSettings {
  allowCreditCardPaymentsIfTheCreditLimitIsReached: boolean;
  allowInvoicePaymentIfCreditLimitIsNotReached: boolean;
  allowToAddEmailRecipientsInCheckout: boolean;
  allowQuotes: boolean;
  bucketSurchargeOrder: Array<BasketSurchargeTypes>;
  basketSurchargeOrder: Array<BasketSurchargeTypes>;
  createDynamicAnonymousAddressForNonLoggedInUser: boolean;
  createDynamicAnonymousBasketForNonLoggedInInUser: boolean;
  displayFeesInSpecialOrderOnCheckoutSummary: boolean;
  guestCheckout: boolean;
  hideAddToBasketLightboxForNonLoggedInUser: boolean;
  hidePricesCamCards: boolean;
  hideTitleFieldOnRegisterForm: boolean;
  preventCamCardERPIdValidation: boolean;
  showAddToCamCardButtonForNonLoggedInUser: boolean;
  showAddToCartButtonForNonLoggedInUser: boolean;
  showAllCamCardsButtonForOrganizationAdmin: boolean;
  showAllDocsType: boolean;
  filterDocsByLanguage: boolean;
  showCountryFieldOnAddressForms: boolean;
  showCustomProductAssortmentForNonLoggedInUser: boolean;
  showDutiesAndSurchargesTotalInBasketSummary: boolean;
  allowToSelectGoodsAcceptanceTimes: boolean;
  showPricesForNonLoggedInUser: boolean;
  showQuestionIfUserWantsToCreateCamCardsBasedOnPurchasedItemsOnCheckoutConfirmationPage: boolean;
  showSubTotalInBasketSummary: boolean;
  showTotalWithoutTaxInBasketSummary: boolean;
  showTotalWithoutTaxInBucketSummary: boolean;
  showWarningMessageForPartialDelivery: boolean;
  useHardcodedAnonymousCustomerForNonLoggedInUser: boolean;
  useHardcodedContactAnonymousCustomerForNonLoggedInUser: boolean;
  use2ndAddressLineInOrderForm: boolean;
  use2ndAddressLineInCamCardForm: boolean;
  showDeliveryIntervalOnCCDetailPage: boolean;
  goodsAcceptanceTimeMandatory: boolean;
  showWarningWhenSystemCouldNotCalculateVolumeOrWeight: boolean;
}

export interface CamfilChannelConfiguration extends Partial<CamfilChannelSettings> {
  channelCode: CamfilChannelCode;
  currency: CamfilCurrency;
  icmChannel: string;
  continueShoppingUrl: string;
  lang: CamfilLang;
  languages: CamfilLang[];
  zipCodeRegExp: string;
}
