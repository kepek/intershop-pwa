import { sortBy } from 'lodash-es';

import { BasketSurcharge } from 'ish-core/models/basket-surcharge/basket-surcharge.model';
import { BasketSurchargeTypes } from 'ish-core/models/basket-surcharge/basket-surcharge.types';
import { PriceHelper } from 'ish-core/models/price/price.helper';

import { QuoteSurchargeItemData } from './quote-surcharge-item.interface';

export class QuoteSurchargeItemMapper {
  static fromData(data: QuoteSurchargeItemData): BasketSurcharge {
    if (data) {
      return {
        amount: {
          gross: parseFloat(data.lineAmount),
          net: parseFloat(data.lineAmount),
          currency: data.currencyCode,
          type: 'PriceItem',
        },
        displayName: data.name,
        description: '',
        strikethrough: parseFloat(data.lineAmount) <= 0,
      };
    }
  }

  static fromListData(data: QuoteSurchargeItemData[]): BasketSurcharge[] {
    if (data?.length) {
      let surcharges = data.map(QuoteSurchargeItemMapper.fromData);

      const shippingFee = surcharges.find(i => i.displayName === BasketSurchargeTypes.ExtraFreightCostRule);
      const shippingDiscount = surcharges.find(i => i.displayName === BasketSurchargeTypes.CamfilExtraFreightDiscount);

      if (
        shippingFee &&
        shippingDiscount &&
        Math.abs(shippingFee.amount.net) === Math.abs(shippingDiscount.amount.net)
      ) {
        surcharges = surcharges
          .map(surcharge => {
            switch (surcharge.displayName) {
              case BasketSurchargeTypes.ExtraFreightCostRule:
                return;
              case BasketSurchargeTypes.CamfilExtraFreightDiscount:
                return { ...surcharge, amount: PriceHelper.invert(surcharge.amount) };
              default:
                return surcharge;
            }
          })
          .filter(Boolean);
      }
      return sortBy(surcharges, 'displayName');
    }
  }
}
