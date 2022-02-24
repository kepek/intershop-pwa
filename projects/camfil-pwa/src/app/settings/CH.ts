// tslint:disable: project-structure ish-ordered-imports
import { CamfilChannelConfiguration } from 'camfil-pwa/models/camfil-channel-configuration/camfil-channel-configuration.model';

const camfilConfiguration: CamfilChannelConfiguration = {
  languages: ['de_DE', 'fr_FR', 'it_IT', 'en_GB'],
  continueShoppingUrl: '/account/camcards',
  channelCode: 'CH',
  currency: 'CHF',
  icmChannel: 'Camfil-CamfilCH-Site',
  showDutiesAndSurchargesTotalInBasketSummary: true,
  showSubTotalInBasketSummary: true,
};

export default camfilConfiguration;
