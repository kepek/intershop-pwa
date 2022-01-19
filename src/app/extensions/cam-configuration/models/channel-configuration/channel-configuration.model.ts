import channelConfig from '../../settings';

export type ChannelSetting = Channel | keyof ChannelSettings;

export interface ChannelSettings {
  allowCreditCardPaymentsIfTheCreditLimitIsReached: boolean;
  allowInvoicePaymentIfCreditLimitIsNotReached: boolean;
  guestCheckout: boolean;
  createDynamicAnonymousAddressForNonLoggedInUser: boolean;
  createDynamicAnonymousBasketForNonLoggedInInUser: boolean;
  hideAddToBasketLightboxForNonLoggedInUser: boolean;
  preventCamCardERPIdValidation: boolean;
  showAddToCamCardButtonForNonLoggedInUser: boolean;
  showAddToCartButtonForNonLoggedInUser: boolean;
  showAllCamCardsButtonForOrganizationAdmin: boolean;
  showCountryFieldOnAddressForms: boolean;
  showCustomProductAssortmentForNonLoggedInUser: boolean;
  showPricesForNonLoggedInUser: boolean;
  showQuestionIfUserWantsToCreateCamCardsBasedOnPurchasedItemsOnCheckoutConfirmationPage: boolean;
  useHardcodedAnonymousCustomerForNonLoggedInUser: boolean;
  useHardcodedContactAnonymousCustomerForNonLoggedInUser: boolean;
}

export interface ChannelConfiguration extends Partial<ChannelSettings> {
  countryCode: string;
  currency: string;
  icmChannel: string;
}

export type Channel = keyof typeof channelConfig;
