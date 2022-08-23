// tslint:disable: project-structure ish-ordered-imports
import { CamfilChannelConfiguration } from 'camfil-pwa/models/camfil-channel-configuration/camfil-channel-configuration.model';
import { BasketSurchargeTypes } from 'ish-core/models/basket-surcharge/basket-surcharge.types';

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
  use2ndAddressLineInOrderForm: true,
  use2ndAddressLineInCamCardForm: true,
  filterDocsByLanguage: true,
  showAllDocsType: true,
  zipCodeRegExp: '^\\d{5}$',
  displayFeesInSpecialOrderOnCheckoutSummary: true,
  bucketSurchargeOrder: [
    BasketSurchargeTypes.ExtraFreightCostRule,
    BasketSurchargeTypes.OrderTopUpShippingRule,
    BasketSurchargeTypes.BoxLabelShippingRule,
    BasketSurchargeTypes.SurchargeGasoil,
  ],
  basketSurchargeOrder: [
    BasketSurchargeTypes.ExtraFreightCostRule,
    BasketSurchargeTypes.OrderTopUpShippingRule,
    BasketSurchargeTypes.BoxLabelShippingRule,
    BasketSurchargeTypes.SurchargeGasoil,
  ],
  showDeliveryIntervalOnCCDetailPage: true,
  showWarningWhenSystemCouldNotCalculateVolumeOrWeight: true,
};

export default camfilConfiguration;
