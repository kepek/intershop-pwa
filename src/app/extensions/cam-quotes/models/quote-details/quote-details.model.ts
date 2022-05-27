import { Address } from 'ish-core/models/address/address.model';
import { Price } from 'ish-core/models/price/price.model';
import { Product } from '../../../../core/models/product/product.model';

import { Quantity } from '../quote-item/quote-item.interface';
import { QuoteStatus, QuoteType } from '../quote/quote.model';

export interface QuoteLineItem {
  type: 'CamfilQuotationLineItem';
  lineItemId: string;
  originSinglePrice: Price;
  originTotalPrice: Price;
  quantity: Quantity;
  singlePrice: Price;
  totalPrice: Price;
  productSKU: string;
  product: Product;
}

export interface QuoteDetails {
  id: string;
  type: string;
  quotationType: QuoteType;
  customerName: string;
  customerNumber: string;
  customerDepartment: string;
  camfilQuoteNumber: string;
  customerQuoteNumber: string;
  requestedBy: string;
  requestedDate: number;
  quotationDate: number;
  status: QuoteStatus;
  statusText: string;
  orderChannel: string;
  displayName: string;
  number: string;
  customerId: string;
  userFirstName: string;
  userLastName: string;
  phone: string;
  customerServiceNote: string;
  editable: boolean;
  submitted: boolean;
  total: Price;
  items: QuoteLineItem[];
  deliveryAddress: Address;
  quotationReference: string;
  validToDate: number;
  taxAmount: Price;
  totalPriceAfterDiscountExVAT: Price;
  totalQty: number;
}
