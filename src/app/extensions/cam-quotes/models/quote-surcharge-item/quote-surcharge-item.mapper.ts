import { sortBy } from 'lodash-es';

import { QuoteSurchargeItemData } from './quote-surcharge-item.interface';
import { QuoteSurchargeItem } from './quote-surcharge-item.model';
import { QuoteSurchargeItemTypes } from './quote-surcharge-item.types';

export class QuoteSurchargeItemMapper {
  static fromData(data: QuoteSurchargeItemData): QuoteSurchargeItem {
    if (data) {
      return {
        amount: {
          value: parseFloat(data.lineAmount),
          currency: data.currencyCode,
          type: 'Money',
        },
        displayName: data.name,
        strikethrough: parseFloat(data.lineAmount) <= 0,
      };
    }
  }

  static fromListData(data: QuoteSurchargeItemData[]): QuoteSurchargeItem[] {
    if (data?.length) {
      let surcharges = data.map(QuoteSurchargeItemMapper.fromData);

      const shippingFee = surcharges.find(i => i.displayName === QuoteSurchargeItemTypes.ExtraFreightCostRule);
      const shippingDiscount = surcharges.find(
        i => i.displayName === QuoteSurchargeItemTypes.CamfilExtraFreightDiscount
      );

      if (
        shippingFee &&
        shippingDiscount &&
        Math.abs(shippingFee.amount.value) === Math.abs(shippingDiscount.amount.value)
      ) {
        surcharges = surcharges
          .map(surcharge => {
            switch (surcharge.displayName) {
              case QuoteSurchargeItemTypes.ExtraFreightCostRule:
                return;
              case QuoteSurchargeItemTypes.CamfilExtraFreightDiscount:
                return { ...surcharge, amount: { ...surcharge.amount, value: surcharge.amount.value * -1 } };
              default:
                return surcharge;
            }
          })
          .filter(Boolean);
      }
      console.log(surcharges);
      return sortBy(surcharges, 'displayName');
    }
  }
}
