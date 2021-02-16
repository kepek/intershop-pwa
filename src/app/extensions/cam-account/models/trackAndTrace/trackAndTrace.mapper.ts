import { Injectable } from '@angular/core';

import { DeliveryAddress } from '../deliveryAddress/deliveryAddress.interface';
import { OrderData } from '../order/order.interface';

@Injectable({ providedIn: 'root' })
export class DeliveryAddressMapper {
  static camfilfromData(payload: OrderData): DeliveryAddress {
    if (!Array.isArray(payload.elements)) {
      const { elements } = payload;
      return {
        deliveryAddressName: elements.deliveryAddressName,
        deliveryAddressName2: elements.deliveryAddressName2,
        deliveryAddressAddress: elements.deliveryAddressAddress,
        deliveryAddressZipCode: elements.deliveryAddressZipCode,
        deliveryAddressCity: elements.deliveryAddressCity,
      };
    }
  }
}
