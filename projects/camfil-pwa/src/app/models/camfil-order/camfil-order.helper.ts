import { CamfilOrderLineItem } from 'camfil-pwa/models/camfil-order-line-item/camfil-order-line-item.model';

import { CamfilOrder } from './camfil-order.model';

export class CamfilOrderHelper {
  static getDeliveryDates(lineItems: CamfilOrderLineItem[]): number[] {
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

  static isPartialDelivery(order: CamfilOrder, lineItems: CamfilOrderLineItem[]): boolean {
    if (!order || lineItems?.length) {
      return false;
    }

    const deliveryDates = CamfilOrderHelper.getDeliveryDates(lineItems);
    const hasMoreThanOneDeliveryDate = deliveryDates?.length > 1;
    const orderDeliveryDate = CamfilOrderHelper.getDeliveryDateWithoutTime(order?.deliveryDate);
    const lastDeliveryDate = CamfilOrderHelper.getDeliveryDateWithoutTime(deliveryDates?.pop());

    return hasMoreThanOneDeliveryDate && lastDeliveryDate > orderDeliveryDate;
  }

  static getTotalDeliveredQty(lineItems: CamfilOrderLineItem[]): number {
    if (!lineItems?.length) {
      return 0;
    }

    return lineItems.reduce((total, current) => total + current.deliveredQty, 0);
  }

  static getTotalOrderedQty(lineItems: CamfilOrderLineItem[]): number {
    if (!lineItems?.length) {
      return 0;
    }

    return lineItems.reduce((total, current) => total + current.orderedQty, 0);
  }
}
