// tslint:disable: project-structure ish-ordered-imports
import { CamfilChannelConfiguration } from 'camfil-pwa/models/camfil-channel-configuration/camfil-channel-configuration.model';

const camfilConfiguration: CamfilChannelConfiguration = {
  languages: ['fr_FR', 'en_GB'],
  continueShoppingUrl: '/home',
  channelCode: 'FR',
  currency: 'EUR',
  guestCheckout: true,
  hideAddToBasketLightboxForNonLoggedInUser: true,
  icmChannel: 'Camfil-CamfilFR-Site',
  preventCamCardERPIdValidation: true,
  showAddToCamCardButtonForNonLoggedInUser: false,
  showAllDocsType: true,
  showCountryFieldOnAddressForms: true,
  showDutiesAndSurchargesTotalInBasketSummary: false,
  showGoodsAcceptanceIcon: true,
  showPricesForNonLoggedInUser: true,
  showSubTotalInBasketSummary: false,
  showTotalWithoutTaxInBasketSummary: true,
  showTotalWithoutTaxInBucketSummary: true,
  showWarningMessageForPartialDelivery: true,
  useSecondAddressLine: true,
};

export default camfilConfiguration;
