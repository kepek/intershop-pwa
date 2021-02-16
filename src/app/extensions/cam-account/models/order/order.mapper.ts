import { Injectable } from '@angular/core';

import { BasketMapper } from 'ish-core/models/basket/basket.mapper';

import { DeliveryAddressMapper } from '../deliveryAddress/deliveryAddress.mapper';
import { OrderLineItem, OrderLineItemData } from '../orderLineItem/orderLineItem.interface';

import { OrderData } from './order.interface';
import { Order } from './order.model';

@Injectable({ providedIn: 'root' })
export class OrderMapper {
  static camfilfromData(payload: OrderData): Order {
    if (!Array.isArray(payload.elements)) {
      const { elements, included } = payload;
      const totals = BasketMapper.getTotals(elements, included ? included.discounts : undefined);

      return {
        id: elements.id,
        documentNo: elements.documentNumber,
        customer: elements.customer,
        creationDate: elements.creationDate,
        orderCreation: elements.orderCreation,
        statusCode: elements.statusCode,
        status: elements.status,
        requisitionNo: elements.requisitionDocumentNo,
        totals,
        contactPerson: elements.contactPerson,
        deliveryDate: elements.deliveryDate,
        camfilNo: elements.customerOrderNumber,
        currency: elements.currency,
        customerName: elements.customerName,
        customerNo: elements.customerNo,
        customerOrderNumber: elements.customerOrderNumber,
        ishOrderUUID: elements.ishOrderUUID,
        orderChannel: elements.orderChannel,
        orderComment: elements.orderComment,
        orderDate: elements.orderDate,
        orderGoodsMark: elements.orderGoodsMark,
        orderStatus: elements.orderStatus,
        orderNumber: elements.orderNumber,
        deliveryAddress: DeliveryAddressMapper.camfilfromData(payload),
        taxAmount: elements.taxAmount,
        totalCustomerPriceSum: elements.totalCustomerPriceSum,
        totalDeliveredQty: elements.totalDeliveredQty,
        totalOrderedQty: elements.totalOrderedQty,
        totalPriceAfterDiscountExVAT: elements.totalPriceAfterDiscountExVAT,
      };
    }
  }

  static camfilfromListData(payload: OrderData): Order[] {
    if (Array.isArray(payload.elements)) {
      return payload.elements.map(elements => OrderMapper.camfilfromData({ ...payload, elements }));
    }
  }

  static camfilfromLineItemData(payload: OrderLineItemData): OrderLineItem {
    if (!Array.isArray(payload.elements)) {
      const { elements } = payload;
      return {
        articleName: elements.articleName,
        boxLabel: elements.boxLabel,
        currency: elements.currency,
        deliveredQty: elements.deliveredQty,
        deliveryDate: elements.deliveryDate,
        id: elements.id,
        name: elements.name,
        orderedQty: elements.orderedQty,
        ownerId: elements.ownerId,
        sku: elements.sku,
        totalRowCustomerPrice: elements.totalRowCustomerPrice,
        type: elements.type,
      };
    }
  }

  static camfilfromLineItemListData(payload: OrderLineItemData): OrderLineItem[] {
    if (Array.isArray(payload.elements)) {
      return payload.elements.map(elements => OrderMapper.camfilfromLineItemData({ ...payload, elements }));
    }
  }
}
