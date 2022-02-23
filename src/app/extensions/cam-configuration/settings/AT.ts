// tslint:disable: project-structure ish-ordered-imports
import { ChannelConfiguration } from '../models/channel-configuration/channel-configuration.model';

const camfilConfiguration: ChannelConfiguration = {
  languages: ['de_DE', 'en_GB'],
  continueShoppingUrl: '/account/camcards',
  channelCode: 'AT',
  currency: 'EUR',
  icmChannel: 'Camfil-CamfilAT-Site',
  showDutiesAndSurchargesTotalInBasketSummary: true,
  showSubTotalInBasketSummary: true,
};

export default camfilConfiguration;
