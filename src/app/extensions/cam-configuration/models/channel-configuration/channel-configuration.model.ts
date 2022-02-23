import channelConfig from '../../settings';

export type ChannelSetting = Channel | keyof ChannelSettings;

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
  countryCode: string;
  currency: string;
  icmChannel: string;
  continueShoppingUrl: string;
}

export type Channel = keyof typeof channelConfig;
