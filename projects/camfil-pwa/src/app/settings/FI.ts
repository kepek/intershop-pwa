// tslint:disable: project-structure ish-ordered-imports
import { CamfilChannelConfiguration } from 'camfil-pwa/models/camfil-channel-configuration/camfil-channel-configuration.model';

const camfilConfiguration: CamfilChannelConfiguration = {
  lang: 'fi_FI',
  languages: ['fi_FI', 'en_GB'],
  continueShoppingUrl: '/account/camcards',
  channelCode: 'FI',
  currency: 'EUR',
  icmChannel: 'Camfil-CamfilFI-Site',
  showAddToCamCardButtonForNonLoggedInUser: true,
  showCountryFieldOnAddressForms: false,
  showDutiesAndSurchargesTotalInBasketSummary: true,
  showSubTotalInBasketSummary: true,
  showTotalWithoutTaxInBasketSummary: false,
  hideTitleFieldOnRegisterForm: true,
  filterDocsByLanguage: true,
  showAllDocsType: true,
  zipCodeRegExp: '^\\d{5}$',
  showWarningWhenSystemCouldNotCalculateVolumeOrWeight: true,
};

export default camfilConfiguration;
