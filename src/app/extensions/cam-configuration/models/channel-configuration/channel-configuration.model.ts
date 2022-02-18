import channelConfig from '../../settings';

export type ChannelSetting = Channel | keyof ChannelSettings;

export interface ChannelSettings {
  allowCreditCardPaymentsIfTheCreditLimitIsReached: boolean;
  allowInvoicePaymentIfCreditLimitIsNotReached: boolean;
  createDynamicAnonymousAddressForNonLoggedInUser: boolean;
  createDynamicAnonymousBasketForNonLoggedInInUser: boolean;
  guestCheckout: boolean;
  hideAddToBasketLightboxForNonLoggedInUser: boolean;
  preventCamCardERPIdValidation: boolean;
  showAddToCamCardButtonForNonLoggedInUser: boolean;
  showAddToCartButtonForNonLoggedInUser: boolean;
  showAllCamCardsButtonForOrganizationAdmin: boolean;
  showCountryFieldOnAddressForms: boolean;
  showCustomProductAssortmentForNonLoggedInUser: boolean;
  showDutiesAndSurchargesTotalInBasketSummary: boolean;
  showTotalWithoutTaxInBasketSummary: boolean;
  showTotalWithoutTaxInBucketSummary: boolean;
  showPricesForNonLoggedInUser: boolean;
  showQuestionIfUserWantsToCreateCamCardsBasedOnPurchasedItemsOnCheckoutConfirmationPage: boolean;
  showSubTotalInBasketSummary: boolean;
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
