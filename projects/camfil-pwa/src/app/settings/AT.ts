// tslint:disable: project-structure ish-ordered-imports
import { CamfilChannelConfiguration } from 'camfil-pwa/models/camfil-channel-configuration/camfil-channel-configuration.model';

const camfilConfiguration: CamfilChannelConfiguration = {
  languages: ['de_DE', 'en_GB'],
  continueShoppingUrl: '/account/camcards',
  channelCode: 'AT',
  currency: 'EUR',
  icmChannel: 'Camfil-CamfilAT-Site',
  showDutiesAndSurchargesTotalInBasketSummary: true,
  showSubTotalInBasketSummary: true,
  filterDocsByLanguage: true,
};

export default camfilConfiguration;
