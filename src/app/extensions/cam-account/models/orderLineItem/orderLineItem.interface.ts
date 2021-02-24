export interface OrderLineItem {
  articleName: string;
  boxLabel: string;
  currency: string;
  deliveredQty: number;
  deliveryDate: number;
  id: string;
  name: string;
  orderedQty: number;
  ownerId: string;
  sku: string;
  totalRowCustomerPrice: number;
  type: string;
}
