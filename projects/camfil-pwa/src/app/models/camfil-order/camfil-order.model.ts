import { CamfilOrderAdditionalTotalCost } from 'camfil-pwa/models/camfil-order-additional-total-cost/camfil-order-additional-total-cost.model';
import { CamfilOrderDeliveryAddress } from 'camfil-pwa/models/camfil-order-delivery-address/camfil-order-delivery-address.model';
import { CamfilOrderLineItem } from 'camfil-pwa/models/camfil-order-line-item/camfil-order-line-item.model';
import { CamfilOrderTrackAndTrace } from 'camfil-pwa/models/camfil-order-track-and-trace/camfil-order-track-and-trace.model';

import { Address } from 'ish-core/models/address/address.model';
import { BasketTotal } from 'ish-core/models/basket-total/basket-total.model';

export interface CamfilOrder extends Pick<BasketTotal, 'itemSurchargeTotalsByType' | 'bucketSurchargeTotalsByType'> {
  id: string;
  contactPerson?: string;
  currency?: string;
  customerName?: string;
  customerDepartment?: string;
  customerNo?: string;
  customerOrderNumber?: string;
  deliveryDate?: number;
  deliveryAddress: CamfilOrderDeliveryAddress;
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
  totalDeliveredQty?: number;
  totalOrderedQty?: number;
  totalPriceAfterDiscountExVAT: number;
  lineItems?: CamfilOrderLineItem[];
  trackAndTrace?: CamfilOrderTrackAndTrace;
  additionalTotalCost?: CamfilOrderAdditionalTotalCost[];
  phoneNotification: string;
  volumeDiscount: number;
  // UI
  deliveryDates?: number[];
  isPartialDelivery?: boolean;
  canReOrder?: boolean;
  commonDeliveryAddress?: Address;
}
