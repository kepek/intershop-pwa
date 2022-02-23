// tslint:disable: project-structure ish-ordered-imports
import { ChannelConfiguration } from '../models/channel-configuration/channel-configuration.model';

const camfilConfiguration: ChannelConfiguration = {
  languages: ['de_DE', 'fr_FR', 'it_IT', 'en_GB'],
  continueShoppingUrl: '/account/camcards',
  channelCode: 'CH',
  currency: 'CHF',
  icmChannel: 'Camfil-CamfilCH-Site',
  showDutiesAndSurchargesTotalInBasketSummary: true,
  showSubTotalInBasketSummary: true,
};

export default camfilConfiguration;
