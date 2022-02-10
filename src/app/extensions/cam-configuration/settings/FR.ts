// tslint:disable: project-structure ish-ordered-imports
import { ChannelConfiguration } from '../models/channel-configuration/channel-configuration.model';

const camfilConfiguration: ChannelConfiguration = {
  continueShoppingUrl: '/home',
  countryCode: 'FR',
  currency: 'EUR',
  guestCheckout: true,
  hideAddToBasketLightboxForNonLoggedInUser: true,
  icmChannel: 'Camfil-CamfilFR-Site',
  preventCamCardERPIdValidation: true,
  showAddToCamCardButtonForNonLoggedInUser: false,
  showCountryFieldOnAddressForms: true,
  showDutiesAndSurchargesTotalInBasketSummary: false,
  showPricesForNonLoggedInUser: true,
  showSubTotalInBasketSummary: false,
  showTotalWithoutTaxInBasketSummary: true,
  showTotalWithoutTaxInBucketSummary: true,
  showWarningMessageForPartialDelivery: true,
  useSecondAddressLine: true,
};

export default camfilConfiguration;
