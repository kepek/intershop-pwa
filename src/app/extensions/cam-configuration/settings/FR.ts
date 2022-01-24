// tslint:disable: project-structure ish-ordered-imports
import { ChannelConfiguration } from '../models/channel-configuration/channel-configuration.model';

const camfilConfiguration: ChannelConfiguration = {
  guestCheckout: true,
  countryCode: 'FR',
  currency: 'EUR',
  icmChannel: 'Camfil-CamfilFR-Site',
  continueShoppingUrl: '/home',
  hideAddToBasketLightboxForNonLoggedInUser: true,
  showCountryFieldOnAddressForms: true,
  showAddToCamCardButtonForNonLoggedInUser: false,
  showPricesForNonLoggedInUser: true,
  preventCamCardERPIdValidation: true,
  useSecondAddressLine: true,
};

export default camfilConfiguration;
