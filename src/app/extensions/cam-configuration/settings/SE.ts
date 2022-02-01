// tslint:disable: project-structure ish-ordered-imports
import { ChannelConfiguration } from '../models/channel-configuration/channel-configuration.model';

const camfilConfiguration: ChannelConfiguration = {
  continueShoppingUrl: '/account/camcards',
  countryCode: 'SE',
  currency: 'EUR',
  guestCheckout: false,
  hideAddToBasketLightboxForNonLoggedInUser: false,
  icmChannel: 'Camfil-CamfilSE-Site',
  showAddToCamCardButtonForNonLoggedInUser: true,
  showCountryFieldOnAddressForms: false,
  showDutiesAndSurchargesTotalInBasketSummary: true,
  showSubTotalInBasketSummary: true,
  showTotalWithoutTaxInBasketSummary: false,
};

export default camfilConfiguration;
