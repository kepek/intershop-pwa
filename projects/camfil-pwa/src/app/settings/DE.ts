// tslint:disable: project-structure ish-ordered-imports
import { CamfilChannelConfiguration } from 'camfil-pwa/models/camfil-channel-configuration/camfil-channel-configuration.model';

const camfilConfiguration: CamfilChannelConfiguration = {
  lang: 'de_DE',
  languages: ['de_DE', 'en_GB'],
  continueShoppingUrl: '/account/camcards',
  channelCode: 'DE',
  currency: 'EUR',
  icmChannel: 'Camfil-CamfilDE-Site',
  allowQuotes: true,
  showDutiesAndSurchargesTotalInBasketSummary: true,
  allowToSelectGoodsAcceptanceTimes: true,
  showSubTotalInBasketSummary: true,
  filterDocsByLanguage: true,
  showAllDocsType: true,
  zipCodeRegExp: '^\\d{5}$',
  use2ndAddressLineInOrderForm: true,
  use2ndAddressLineInCamCardForm: true,
  showDeliveryIntervalOnCCDetailPage: true,
  preventCamCardERPIdValidation: true,
  showWarningWhenSystemCouldNotCalculateVolumeOrWeight: true,
  goodsAcceptanceTimeMandatory: true,
};

export default camfilConfiguration;
