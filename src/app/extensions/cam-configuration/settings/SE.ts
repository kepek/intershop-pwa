// tslint:disable: project-structure ish-ordered-imports
import { ChannelConfiguration } from '../models/channel-configuration/channel-configuration.model';

const camfilConfiguration: ChannelConfiguration = {
  languages: ['sv_SE', 'en_GB'],
  continueShoppingUrl: '/account/camcards',
  channelCode: 'SE',
  currency: 'EUR',
  guestCheckout: false,
  hideAddToBasketLightboxForNonLoggedInUser: false,
  icmChannel: 'Camfil-CamfilSE-Site',
  showAddToCamCardButtonForNonLoggedInUser: true,
  showCountryFieldOnAddressForms: false,
  showDutiesAndSurchargesTotalInBasketSummary: true,
  showSubTotalInBasketSummary: true,
  showTotalWithoutTaxInBasketSummary: false,
  hidePricesCamCards: true,
};

export default camfilConfiguration;
