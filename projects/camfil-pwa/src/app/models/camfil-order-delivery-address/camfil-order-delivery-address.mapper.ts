import { Injectable } from '@angular/core';
import { CamfilOrderData } from 'camfil-pwa/models/camfil-order/camfil-order.interface';

import { Address } from 'ish-core/models/address/address.model';

import { CamfilOrderDeliveryAddressData } from './camfil-order-delivery-address.interface';

@Injectable({ providedIn: 'root' })
export class CamfilOrderDeliveryAddressMapper {
  static fromData(orderData: CamfilOrderData): CamfilOrderDeliveryAddressData {
    if (orderData) {
      return {
        deliveryAddressName: orderData.deliveryAddressName,
        deliveryAddressName2: orderData.deliveryAddressName2,
        deliveryAddressAddress: orderData.deliveryAddressAddress,
        deliveryAddressAddressOptional: orderData.deliveryAddressAddressOptional,
        deliveryAddressZipCode: orderData.deliveryAddressZipCode,
        deliveryAddressCity: orderData.deliveryAddressCity,
        deliveryAddressCountryCode: orderData.deliveryAddressCountryCode,
        deliveryAddressGoodsAcceptanceNote: orderData.goodsAcceptanceNote,
      };
    }
  }
  static addressFromDeliveryAddress(deliveryAddress: CamfilOrderDeliveryAddressData): Address {
    if (deliveryAddress) {
      return {
        companyName1: deliveryAddress.deliveryAddressName,
        companyName2: deliveryAddress.deliveryAddressName2,
        addressLine1: deliveryAddress.deliveryAddressAddress,
        addressLine2: deliveryAddress.deliveryAddressAddressOptional || '',
        postalCode: deliveryAddress.deliveryAddressZipCode,
        city: deliveryAddress.deliveryAddressCity,
        countryCode: deliveryAddress.deliveryAddressCountryCode || '',
        goodsAcceptanceNote: deliveryAddress.deliveryAddressGoodsAcceptanceNote,

        // not used, but required for "Address" type
        id: '',
        urn: '',
        addressName: '',
        firstName: '',
        lastName: '',
        country: '',
        phoneHome: '',
        invoiceToAddress: undefined,
        shipToAddress: undefined,
      };
    }
  }
}
