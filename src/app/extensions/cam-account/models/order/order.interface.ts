import { BasketBaseData } from 'ish-core/models/basket/basket.interface';

export interface OrderData extends Pick<BasketBaseData, 'surcharges'> {
  id: string;
  contactPerson?: string;
  currency?: string;
  customerName?: string;
  customerNo?: string;
  customerOrderNumber?: string;
  deliveryDate?: number;
  camfilNo?: string;
  ishOrderUUID?: string;
  orderChannel?: string;
  orderComment?: string;
  orderDate?: string;
  orderGoodsMark?: string;
  orderStatus?: string;
  orderNumber?: string;
  deliveryAddressName: string;
  deliveryAddressName2?: string;
  deliveryAddressAddress: string;
  deliveryAddressZipCode: string;
  deliveryAddressCity: string;
  phoneNotification: string;
  taxAmount: number;
  totalCustomerPriceSum: number;
  totalDeliveredQty: number;
  totalOrderedQty: number;
  totalPriceAfterDiscountExVAT: number;
  volumeDiscount: number;
  customerDepartment: string;
}
