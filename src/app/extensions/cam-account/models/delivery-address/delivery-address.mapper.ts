import { Injectable } from '@angular/core';

import { OrderData } from '../order/order.interface';

import { DeliveryAddressData } from './delivery-address.interface';

@Injectable({ providedIn: 'root' })
export class DeliveryAddressMapper {
  static fromData(orderData: OrderData): DeliveryAddressData {
    if (orderData) {
      return {
        deliveryAddressName: orderData.deliveryAddressName,
        deliveryAddressName2: orderData.deliveryAddressName2,
        deliveryAddressAddress: orderData.deliveryAddressAddress,
        deliveryAddressZipCode: orderData.deliveryAddressZipCode,
        deliveryAddressCity: orderData.deliveryAddressCity,
      };
    }
  }
}
