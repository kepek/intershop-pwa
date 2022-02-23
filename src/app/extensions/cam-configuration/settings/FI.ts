// tslint:disable: project-structure ish-ordered-imports
import { ChannelConfiguration } from '../models/channel-configuration/channel-configuration.model';

const camfilConfiguration: ChannelConfiguration = {
  languages: ['fi_FI', 'en_GB'],
  continueShoppingUrl: '/account/camcards',
  channelCode: 'FI',
  currency: 'EUR',
  guestCheckout: false,
  hideAddToBasketLightboxForNonLoggedInUser: false,
  icmChannel: 'Camfil-CamfilFI-Site',
  showAddToCamCardButtonForNonLoggedInUser: true,
  showCountryFieldOnAddressForms: false,
  showDutiesAndSurchargesTotalInBasketSummary: true,
  showSubTotalInBasketSummary: true,
  showTotalWithoutTaxInBasketSummary: false,
  hideTitleFieldOnRegisterForm: true,
};

export default camfilConfiguration;
