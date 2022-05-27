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

  static sortSurchargeTotalsByType(surchargeTotalsByType: BasketSurcharge[], surchargeSortingOrder: string[]) {
    console.log({ surchargeSortingOrder });
    console.log({ surchargeTotalsByType });
    return surchargeTotalsByType
      .slice()
      .sort((a, b) => surchargeSortingOrder.indexOf(a.displayName) - surchargeSortingOrder.indexOf(b.displayName));
  }
}
