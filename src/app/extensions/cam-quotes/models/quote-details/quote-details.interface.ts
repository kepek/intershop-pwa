import { AddressData } from 'ish-core/models/address/address.interface';
import { Price } from 'ish-core/models/price/price.model';
import { Product } from '../../../../core/models/product/product.model';

import { Quantity } from '../quote-item/quote-item.interface';

export interface QuoteDetailsData {
  id: string;
  type: 'QuoteRequest';
  quotationType: 'quotation' | 'proposal';
  displayName: string;
  number: string;
  customerName: string;
  customerDepartment: string;
  customerId: string;
  userFirstName: string;
  userLastName: string;
  phone: string;
  customerServiceNote: string;
  status: number;
  editable: boolean;
  submitted: boolean;
  creationDate: number;
  submittedDate: number;
  total: Price;
  items: {
    type: 'CamfilQuotationLineItem';
    lineItemId: string;
    originSinglePrice: Price;
    originTotalPrice: Price;
    quantity: Quantity;
    singlePrice: Price;
    totalPrice: Price;
    productSKU: string;
    product: Product;
  }[];
  deliveryAddress: AddressData;
  erpnumber: string;
  orderChannel: string;
  quotationReference: string;
  validToDate: number;
  taxAmount: Price;
  totalPriceAfterDiscountExVAT: Price;
  totalQty: number;
}
