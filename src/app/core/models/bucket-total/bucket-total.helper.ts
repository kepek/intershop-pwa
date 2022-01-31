import { BasketSurcharge } from 'ish-core/models/basket-surcharge/basket-surcharge.model';
import { PriceItem } from 'ish-core/models/price-item/price-item.model';

export class BucketTotalHelper {
  static getSurchargeTotal(data: BasketSurcharge[]): PriceItem {
    const calculable = data?.filter(surcharge => !surcharge?.strikethrough);

    if (!calculable?.length) {
      return;
    }

    const initialValue: PriceItem = {
      type: 'PriceItem',
      gross: 0,
      net: 0,
      currency: 'N/A',
    };

    return calculable.reduce((acc, value) => {
      const gross = acc?.gross + value?.amount?.gross;
      const net = acc?.net + value?.amount?.net;
      const tax = gross && net ? gross - net : undefined;

      console.log({ tax });

      return { ...acc, ...value?.amount, gross, net, tax };
    }, initialValue);
  }
}
