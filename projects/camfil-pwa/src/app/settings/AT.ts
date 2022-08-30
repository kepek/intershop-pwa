// tslint:disable: project-structure ish-ordered-imports
import { CamfilChannelConfiguration } from 'camfil-pwa/models/camfil-channel-configuration/camfil-channel-configuration.model';

const camfilConfiguration: CamfilChannelConfiguration = {
  lang: 'de_DE',
  languages: ['de_DE', 'en_GB'],
  continueShoppingUrl: '/account/camcards',
  channelCode: 'AT',
  currency: 'EUR',
  icmChannel: 'Camfil-CamfilAT-Site',
  showDutiesAndSurchargesTotalInBasketSummary: true,
  showSubTotalInBasketSummary: true,
  filterDocsByLanguage: true,
  showAllDocsType: true,
  zipCodeRegExp: '^\\d{4}$',
  use2ndAddressLineInOrderForm: true,
  use2ndAddressLineInCamCardForm: true,
  showDeliveryIntervalOnCCDetailPage: true,
  preventCamCardERPIdValidation: true,
  allowToSelectGoodsAcceptanceTimes: true,
  showWarningMessageForPartialDelivery: true,
  showWarningWhenSystemCouldNotCalculateVolumeOrWeight: true,
};

export default camfilConfiguration;
