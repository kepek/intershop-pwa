import { OrderLineItem } from '../order-line-item/order-line-item.model';

import { Order } from './order.model';

export class OrderHelper {
  static getDeliveryDates(lineItems: OrderLineItem[]): number[] {
    if (!lineItems?.length) {
      return [];
    }

    return lineItems
      .reduce<number[]>((acc, { deliveryDate }) => (acc.includes(deliveryDate) ? acc : [...acc, deliveryDate]), [])
      .sort();
  }

  static getDeliveryDateWithoutTime(d: number): number {
    if (!d) {
      return 0;
    }

    Math.floor(d / (24 * 60 * 60 * 1000));
  }

  static isPartialDelivery(order: Order, lineItems: OrderLineItem[]): boolean {
    if (!order || lineItems?.length) {
      return false;
    }

    const deliveryDates = OrderHelper.getDeliveryDates(lineItems);
    const hasMoreThanOneDeliveryDate = deliveryDates?.length > 1;
    const orderDeliveryDate = OrderHelper.getDeliveryDateWithoutTime(order?.deliveryDate);
    const lastDeliveryDate = OrderHelper.getDeliveryDateWithoutTime(deliveryDates?.pop());

    return hasMoreThanOneDeliveryDate && lastDeliveryDate > orderDeliveryDate;
  }

  static getTotalDeliveredQty(lineItems: OrderLineItem[]): number {
    if (!lineItems?.length) {
      return 0;
    }

    return lineItems.reduce((total, current) => total + current.deliveredQty, 0);
  }

  static getTotalOrderedQty(lineItems: OrderLineItem[]): number {
    if (!lineItems?.length) {
      return 0;
    }

    return lineItems.reduce((total, current) => total + current.orderedQty, 0);
  }
}
