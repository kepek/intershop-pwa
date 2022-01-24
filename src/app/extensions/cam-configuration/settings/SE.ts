// tslint:disable: project-structure ish-ordered-imports
import { ChannelConfiguration } from '../models/channel-configuration/channel-configuration.model';

const camfilConfiguration: ChannelConfiguration = {
  guestCheckout: false,
  countryCode: 'SE',
  currency: 'EUR',
  icmChannel: 'Camfil-CamfilSE-Site',
  continueShoppingUrl: '/account/camcards',
  hideAddToBasketLightboxForNonLoggedInUser: false,
  showCountryFieldOnAddressForms: false,
  showAddToCamCardButtonForNonLoggedInUser: true,
};

export default camfilConfiguration;
