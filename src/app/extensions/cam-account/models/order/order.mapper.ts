import { Injectable } from '@angular/core';

import { DeliveryAddressMapper } from '../deliveryAddress/deliveryAddress.mapper';
import { OrderLineItem } from '../orderLineItem/orderLineItem.interface';

import { OrderData } from './order.interface';
import { Order } from './order.model';

@Injectable({ providedIn: 'root' })
export class OrderMapper {
  static fromData(orderData: OrderData): Order {
    if (orderData) {
      return {
        id: orderData.id,
        contactPerson: orderData.contactPerson,
        deliveryDate: orderData.deliveryDate,
        camfilNo: orderData.customerOrderNumber,
        currency: orderData.currency,
        customerName: orderData.customerName,
        customerNo: orderData.customerNo,
        customerOrderNumber: orderData.customerOrderNumber,
        ishOrderUUID: orderData.ishOrderUUID,
        orderChannel: orderData.orderChannel,
        orderComment: orderData.orderComment,
        orderDate: orderData.orderDate,
        orderGoodsMark: orderData.orderGoodsMark,
        // If there is no order status then use default status
        orderStatus: orderData.orderStatus ? orderData.orderStatus : 'Received',
        orderNumber: orderData.orderNumber,
        deliveryAddress: DeliveryAddressMapper.fromData(orderData),
        taxAmount: orderData.taxAmount,
        totalCustomerPriceSum: orderData.totalCustomerPriceSum,
        totalDeliveredQty: orderData.totalDeliveredQty,
        totalOrderedQty: orderData.totalOrderedQty,
        totalPriceAfterDiscountExVAT: orderData.totalPriceAfterDiscountExVAT,
      };
    }
  }

  static fromLineItemData(lineItemData: OrderLineItem): OrderLineItem {
    if (lineItemData) {
      return {
        articleName: lineItemData.articleName,
        boxLabel: lineItemData.boxLabel,
        currency: lineItemData.currency,
        deliveredQty: lineItemData.deliveredQty,
        deliveryDate: lineItemData.deliveryDate,
        id: lineItemData.id,
        name: lineItemData.name,
        orderedQty: lineItemData.orderedQty,
        ownerId: lineItemData.ownerId,
        sku: lineItemData.sku,
        totalRowCustomerPrice: lineItemData.totalRowCustomerPrice,
        type: lineItemData.type,
      };
    }
  }
}
