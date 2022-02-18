import { Injectable } from '@angular/core';
import { CamfilOrderDeliveryAddressMapper } from 'camfil-pwa/models/camfil-order-delivery-address/camfil-order-delivery-address.mapper';

import { BasketSurchargeMapper } from 'ish-core/models/basket-surcharge/basket-surcharge.mapper';

import { CamfilOrderData } from './camfil-order.interface';
import { CamfilOrder } from './camfil-order.model';

@Injectable({ providedIn: 'root' })
export class CamfilOrderMapper {
  static fromData(data: CamfilOrderData): CamfilOrder {
    if (data) {
      const camfilNo = data.customerOrderNumber;
      const orderStatus = data?.orderStatus || 'Created';
      const deliveryAddress = CamfilOrderDeliveryAddressMapper.fromData(data);
      const commonDeliveryAddress = CamfilOrderDeliveryAddressMapper.addressFromDeliveryAddress(deliveryAddress);
      const itemSurchargeTotalsByType = BasketSurchargeMapper.fromListData(data?.surcharges?.itemSurcharges);
      const bucketSurchargeTotalsByType = BasketSurchargeMapper.fromListData(data?.surcharges?.bucketSurcharges);

      return {
        id: data.id,
        contactPerson: data.contactPerson,
        deliveryDate: data.deliveryDate,
        currency: data.currency,
        customerName: data.customerName,
        customerNo: data.customerNo,
        customerOrderNumber: data.customerOrderNumber,
        customerDepartment: data.customerDepartment,
        ishOrderUUID: data.ishOrderUUID,
        orderChannel: data.orderChannel,
        orderComment: data.orderComment,
        orderDate: data.orderDate,
        orderGoodsMark: data.orderGoodsMark,
        orderNumber: data.orderNumber,
        taxAmount: data.taxAmount,
        totalCustomerPriceSum: data.totalCustomerPriceSum,
        totalDeliveredQty: data.totalDeliveredQty,
        totalOrderedQty: data.totalOrderedQty,
        totalPriceAfterDiscountExVAT: data.totalPriceAfterDiscountExVAT,
        phoneNotification: data.phoneNotification,
        volumeDiscount: data.volumeDiscount,
        camfilNo,
        orderStatus, // If there is no order status then use default status
        deliveryAddress,
        commonDeliveryAddress,
        itemSurchargeTotalsByType,
        bucketSurchargeTotalsByType,
      };
    }
  }
}
