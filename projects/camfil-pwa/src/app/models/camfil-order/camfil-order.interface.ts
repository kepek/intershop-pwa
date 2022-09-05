import { BasketBaseData } from 'ish-core/models/basket/basket.interface';

export interface CamfilOrderData extends Pick<BasketBaseData, 'surcharges'> {
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
  deliveryAddressAddressOptional?: string;
  deliveryAddressZipCode: string;
  deliveryAddressCity: string;
  deliveryAddressCountryCode?: string;
  phoneNotification: string;
  taxAmount: number;
  totalCustomerPriceSum: number;
  totalDeliveredQty: number;
  totalOrderedQty: number;
  totalPriceAfterDiscountExVAT: number;
  volumeDiscount: number;
  customerDepartment: string;
  goodsAcceptanceNote: string;
}
