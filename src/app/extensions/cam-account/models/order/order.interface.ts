export interface OrderData {
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
}
