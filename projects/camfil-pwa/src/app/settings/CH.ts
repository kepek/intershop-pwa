// tslint:disable: project-structure ish-ordered-imports
import { CamfilChannelConfiguration } from 'camfil-pwa/models/camfil-channel-configuration/camfil-channel-configuration.model';

const camfilConfiguration: CamfilChannelConfiguration = {
  languages: ['de_CH', 'fr_FR', 'it_IT', 'en_GB'],
  continueShoppingUrl: '/account/camcards',
  channelCode: 'CH',
  currency: 'CHF',
  icmChannel: 'Camfil-CamfilCH-Site',
  showDutiesAndSurchargesTotalInBasketSummary: true,
  showSubTotalInBasketSummary: true,
  filterDocsByLanguage: true,
  showAllDocsType: true,
  zipCodeRegExp: '^\\d{4}$',
  use2ndAddressLineInOrderForm: true,
  use2ndAddressLineInCamCardForm: true,
  preventCamCardERPIdValidation: true,
  showWarningWhenSystemCouldNotCalculateVolumeOrWeight: true,
  allowToSelectGoodsAcceptanceTimes: true,
};

export default camfilConfiguration;
