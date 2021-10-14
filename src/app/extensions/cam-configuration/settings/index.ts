// tslint:disable: project-structure ish-ordered-imports force-jsdoc-comments
import FI from './FI';
import FR from './FR';
import SE from './SE';

export const channelConfig = { FI, FR, SE };

export type Channel = keyof typeof channelConfig;

export type ChannelSetting = Channel | keyof ChannelSettings;

export interface ChannelSettings {
  allowCreditCardPaymentsIfTheCreditLimitIsReached: boolean;
  allowInvoicePaymentIfCreditLimitIsNotReached: boolean;
  allowAnonymusUserToNavigateToCheckoutPage: boolean;
  createDynamicAnonymousAddressForNonLoggedInUser: boolean;
  createDynamicAnonymousBasketForNonLoggedInInUser: boolean;
  hideAddToBasketLightboxForNonLoggedInUser: boolean;
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

export default channelConfig;
