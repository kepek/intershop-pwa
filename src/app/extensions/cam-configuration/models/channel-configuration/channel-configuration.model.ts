import channelConfig from '../../settings';

export type CamfilChannelCode = keyof typeof channelConfig;

export type CamfilCurrency = 'EUR' | 'SEK' | 'CHF';

export type CamfilLang = 'de_DE' | 'en_GB' | 'fi_FI' | 'fr_FR' | 'it_IT' | 'sv_SE';

export type ChannelSetting = CamfilChannelCode | keyof ChannelSettings;

export interface ChannelSettings {
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

export interface ChannelConfiguration extends Partial<ChannelSettings> {
  channelCode: CamfilChannelCode;
  currency: CamfilCurrency;
  icmChannel: string;
  continueShoppingUrl: string;
  languages: CamfilLang[];
}
