// tslint:disable: project-structure ish-ordered-imports
import { CamfilChannelConfiguration } from 'camfil-pwa/models/camfil-channel-configuration/camfil-channel-configuration.model';

const camfilConfiguration: CamfilChannelConfiguration = {
  languages: ['fr_FR', 'en_GB'],
  continueShoppingUrl: '/home',
  channelCode: 'FR',
  currency: 'EUR',
  icmChannel: 'Camfil-CamfilFR-Site',
  allowQuotes: true,
  preventCamCardERPIdValidation: true,
  showAddToCamCardButtonForNonLoggedInUser: false,
  showCountryFieldOnAddressForms: true,
  showDutiesAndSurchargesTotalInBasketSummary: true,
  showPricesForNonLoggedInUser: true,
  showSubTotalInBasketSummary: false,
  showTotalWithoutTaxInBasketSummary: true,
  showTotalWithoutTaxInBucketSummary: true,
  showWarningMessageForPartialDelivery: true,
  useSecondAddressLine: true,
  filterDocsByLanguage: true,
  showAllDocsType: true,
  zipCodeRegExp: '^\\d{5}$',
  displayFeesInSpecialOrderOnCheckoutSummary: true,
};

export default camfilConfiguration;
