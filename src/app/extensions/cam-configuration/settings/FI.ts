// tslint:disable: project-structure ish-ordered-imports
import { ChannelConfiguration } from '../models/channel-configuration/channel-configuration.model';

const camfilConfiguration: ChannelConfiguration = {
  guestCheckout: false,
  countryCode: 'FI',
  currency: 'EUR',
  icmChannel: 'Camfil-CamfilFI-Site',
  continueShoppingUrl: '/account/camcards',
  hideAddToBasketLightboxForNonLoggedInUser: false,
  showCountryFieldOnAddressForms: false,
  showAddToCamCardButtonForNonLoggedInUser: true,
};

export default camfilConfiguration;
