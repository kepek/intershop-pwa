import { BasketSurchargeHelper } from 'ish-core/models/basket-surcharge/basket-surcharge.helper';
import { BasketSurchargeTypes } from 'ish-core/models/basket-surcharge/basket-surcharge.types';
import { PriceItemMapper } from 'ish-core/models/price-item/price-item.mapper';
import { PriceHelper } from 'ish-core/models/price/price.helper';

import { BasketSurchargeData } from './basket-surcharge.interface';
import { BasketSurcharge } from './basket-surcharge.model';

export class BasketSurchargeMapper {
  static fromData(data: BasketSurchargeData): BasketSurcharge {
    if (data) {
      return {
        amount: PriceItemMapper.fromPriceItem(data.amount),
        displayName: data.name,
        description: data.description,
        taxes: data?.taxes?.map(PriceItemMapper.fromPriceItem)?.filter(Boolean),
      };
    }
  }

  static fromListData(data: BasketSurchargeData[]): BasketSurcharge[] {
    if (data?.length) {
      let surcharges = data.map(BasketSurchargeMapper.fromData);

      const shippingDiscountSurcharge = BasketSurchargeHelper.select(surcharges, BasketSurchargeTypes.ShippingDiscount);
      const shippingFeeSurcharge = BasketSurchargeHelper.select(surcharges, BasketSurchargeTypes.ShippingDiscount);

      if (BasketSurchargeHelper.equal(shippingDiscountSurcharge, shippingFeeSurcharge)) {
        surcharges = surcharges
          ?.map(surcharge => ({ ...surcharge, strikethrough: surcharge?.amount.net <= 0 }))
          ?.map(surcharge => {
            switch (surcharge.displayName) {
              case BasketSurchargeTypes.ShippingFee:
                return;
              case BasketSurchargeTypes.ShippingDiscount:
                return { ...surcharge, amount: PriceHelper.invert(surcharge.amount) };
              default:
                return surcharge;
            }
          })
          .filter(Boolean);
      }

      return surcharges;
    }
  }
}
