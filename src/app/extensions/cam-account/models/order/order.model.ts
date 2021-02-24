
import { AdditionalTotalCost } from '../additionalTotalCost/additionalTotalCost.interface';
import { DeliveryAddress } from '../deliveryAddress/deliveryAddress.interface';
import { TrackAndTrace } from '../trackAndTrace/trackAndTrace.interface';

export interface Order {
  id: string;
  contactPerson?: string;
  currency?: string;
  customerName?: string;
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
  taxAmount: number;
  totalCustomerPriceSum: number;
  totalDeliveredQty: number;
  totalOrderedQty: number;
  totalPriceAfterDiscountExVAT: number;
  lineItems?: [];
  trackAndTrace?: TrackAndTrace;
  additionalTotalCost?: AdditionalTotalCost;
}
