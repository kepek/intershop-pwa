import { Injectable } from '@angular/core';

import { Address } from 'ish-core/models/address/address.model';

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
        deliveryAddressAddressOptional: orderData.deliveryAddressAddressOptional,
        deliveryAddressZipCode: orderData.deliveryAddressZipCode,
        deliveryAddressCity: orderData.deliveryAddressCity,
        deliveryAddressCountryCode: orderData.deliveryAddressCountryCode,
      };
    }
  }
  static addressFromDeliveryAddress(deliveryAddress: DeliveryAddressData): Address {
    if (deliveryAddress) {
      return {
        companyName1: deliveryAddress.deliveryAddressName,
        companyName2: deliveryAddress.deliveryAddressName2,
        addressLine1: deliveryAddress.deliveryAddressAddress,
        addressLine2: deliveryAddress.deliveryAddressAddressOptional || '',
        postalCode: deliveryAddress.deliveryAddressZipCode,
        city: deliveryAddress.deliveryAddressCity,

        // not used, but required for "Address" type
        id: '',
        urn: '',
        addressName: '',
        firstName: '',
        lastName: '',
        country: '',
        countryCode: '',
        phoneHome: '',
        invoiceToAddress: undefined,
        shipToAddress: undefined,
      };
    }
  }
}
