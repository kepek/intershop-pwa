// tslint:disable: project-structure ish-ordered-imports
import { CamfilChannelConfiguration } from 'camfil-pwa/models/camfil-channel-configuration/camfil-channel-configuration.model';

const camfilConfiguration: CamfilChannelConfiguration = {
  languages: ['sv_SE', 'en_GB'],
  continueShoppingUrl: '/account/camcards',
  channelCode: 'SE',
  currency: 'EUR',
  icmChannel: 'Camfil-CamfilSE-Site',
  showAddToCamCardButtonForNonLoggedInUser: true,
  showCountryFieldOnAddressForms: false,
  showDutiesAndSurchargesTotalInBasketSummary: true,
  showSubTotalInBasketSummary: true,
  showTotalWithoutTaxInBasketSummary: false,
  hidePricesCamCards: true,
  filterDocsByLanguage: true,
  showAllDocsType: true,
  zipCodeRegExp: '^\\d{3}\\s*\\d{2}$',
  showWarningWhenSystemCouldNotCalculateVolumeOrWeight: true,
};

export default camfilConfiguration;
