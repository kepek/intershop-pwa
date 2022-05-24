import { BasketSurcharge } from './basket-surcharge.model';
import { BasketSurchargeTypes } from './basket-surcharge.types';

export class BasketSurchargeHelper {
  static equal(sur1: BasketSurcharge, sur2: BasketSurcharge): boolean {
    if (!sur1 || !sur2) {
      return false;
    }

    if (sur1?.amount?.net && sur2?.amount?.net) {
      return Math.abs(sur1.amount.net) === Math.abs(sur2.amount.net);
    }
  }

  static select(data: BasketSurcharge[], displayName: BasketSurchargeTypes): BasketSurcharge {
    if (!data || data?.length === 0) {
      return;
    }

    return data?.find(s => s.displayName === displayName);
  }

  static sortbucketSurchargeTotalsByType(bucketSurchargeTotalsByType: BasketSurcharge[]) {
    const surchargeOrder = [
      'CAMFIL_EXTRA_FREIGHT_COST_RULE',
      'CAMFIL_MINIMUM_ORDER_TOPUP',
      'CAMFIL_BOX_LABEL_FEE',
      'Surcharge Gasoil',
    ];

    return bucketSurchargeTotalsByType
      .slice()
      .sort((a, b) => surchargeOrder.indexOf(a.displayName) - surchargeOrder.indexOf(b.displayName));
  }
}
