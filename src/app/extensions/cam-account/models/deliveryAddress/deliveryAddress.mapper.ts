import { Injectable } from '@angular/core';

import { OrderData } from '../order/order.interface';

import { DeliveryAddress } from './deliveryAddress.interface';

@Injectable({ providedIn: 'root' })
export class DeliveryAddressMapper {
  static fromData(orderData: OrderData): DeliveryAddress {
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
