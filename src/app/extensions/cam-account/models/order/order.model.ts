import { BasketTotal } from 'ish-core/models/basket-total/basket-total.model';

import { AdditionalTotalCost } from '../additional-total-cost/additional-total-cost.model';
import { DeliveryAddress } from '../delivery-address/delivery-address.model';
import { OrderLineItem } from '../order-line-item/order-line-item.model';
import { TrackAndTrace } from '../track-and-trace/track-and-trace.model';

export interface Order extends Pick<BasketTotal, 'itemSurchargeTotalsByType' | 'bucketSurchargeTotalsByType'> {
  id: string;
  contactPerson?: string;
  currency?: string;
  customerName?: string;
  customerDepartment?: string;
  customerNo?: string;
  customerOrderNumber?: string;
  deliveryDate?: number;
  deliveryAddress: DeliveryAddress;
  camfilNo?: string;
  ishOrderUUID?: string;
  orderChannel?: string;
  orderComment?: string;
  orderDate?: string;
  orderGoodsMark?: string;
  orderStatus?: string;
  orderNumber?: string;
  taxAmount?: number;
  totalCustomerPriceSum: number;
  totalDeliveredQty: number;
  totalOrderedQty: number;
  totalPriceAfterDiscountExVAT: number;
  lineItems?: OrderLineItem[];
  trackAndTrace?: TrackAndTrace;
  additionalTotalCost?: AdditionalTotalCost[];
  phoneNotification: string;
  volumeDiscount: number;
  // UI
  deliveryDates?: number[];
  isPartialDelivery?: boolean;
  canReOrder?: boolean;
}
