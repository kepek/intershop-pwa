import channelConfig from 'camfil-pwa/settings';

export type CamfilChannelCode = keyof typeof channelConfig;

export type CamfilCurrency = 'EUR' | 'SEK' | 'CHF';

export type CamfilLang = 'de_DE' | 'de_CH' | 'en_GB' | 'fi_FI' | 'fr_FR' | 'it_IT' | 'sv_SE';

export type CamfilChannelSetting = CamfilChannelCode | keyof CamfilChannelSettings;

export interface CamfilChannelSettings {
  allowCreditCardPaymentsIfTheCreditLimitIsReached: boolean;
  allowInvoicePaymentIfCreditLimitIsNotReached: boolean;
  allowToAddEmailRecipientsInCheckout: boolean;
  createDynamicAnonymousAddressForNonLoggedInUser: boolean;
  createDynamicAnonymousBasketForNonLoggedInInUser: boolean;
  guestCheckout: boolean;
  hideAddToBasketLightboxForNonLoggedInUser: boolean;
  hidePricesCamCards: boolean;
  hideTitleFieldOnRegisterForm: boolean;
  preventCamCardERPIdValidation: boolean;
  showAddToCamCardButtonForNonLoggedInUser: boolean;
  showAddToCartButtonForNonLoggedInUser: boolean;
  showAllCamCardsButtonForOrganizationAdmin: boolean;
  showAllDocsType: boolean;
  showCountryFieldOnAddressForms: boolean;
  showCustomProductAssortmentForNonLoggedInUser: boolean;
  showDutiesAndSurchargesTotalInBasketSummary: boolean;
  showPricesForNonLoggedInUser: boolean;
  showQuestionIfUserWantsToCreateCamCardsBasedOnPurchasedItemsOnCheckoutConfirmationPage: boolean;
  showSubTotalInBasketSummary: boolean;
  showTotalWithoutTaxInBasketSummary: boolean;
  showTotalWithoutTaxInBucketSummary: boolean;
  showWarningMessageForPartialDelivery: boolean;
  useHardcodedAnonymousCustomerForNonLoggedInUser: boolean;
  useHardcodedContactAnonymousCustomerForNonLoggedInUser: boolean;
  useSecondAddressLine: boolean;
}

export interface CamfilChannelConfiguration extends Partial<CamfilChannelSettings> {
  channelCode: CamfilChannelCode;
  currency: CamfilCurrency;
  icmChannel: string;
  continueShoppingUrl: string;
  languages: CamfilLang[];
}
