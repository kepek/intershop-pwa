import { AddressData } from 'ish-core/models/address/address.interface';
import { Address } from 'ish-core/models/address/address.model';
import { Attribute } from 'ish-core/models/attribute/attribute.model';
import { BasketApproval } from 'ish-core/models/basket-approval/basket-approval.model';
import { BasketInfo } from 'ish-core/models/basket-info/basket-info.model';
import { BasketRebateData } from 'ish-core/models/basket-rebate/basket-rebate.interface';
import { BasketTotalData } from 'ish-core/models/basket-total/basket-total.interface';
import { CamfilLineItemData, LineItemData } from 'ish-core/models/line-item/line-item.interface';
import { PaymentInstrument } from 'ish-core/models/payment-instrument/payment-instrument.model';
import { PaymentMethodBaseData } from 'ish-core/models/payment-method/payment-method.interface';
import { PaymentData } from 'ish-core/models/payment/payment.interface';
import { PriceItemData } from 'ish-core/models/price-item/price-item.interface';
import { ShippingMethodData } from 'ish-core/models/shipping-method/shipping-method.interface';

import { CamCardContact, CamCardCustomer } from '../../../extensions/cam-cards/models/cam-card/cam-card.model';

export interface BasketBaseData {
  id: string;
  purchaseCurrency?: string;
  calculated: boolean;
  invoiceToAddress?: string;
  commonShipToAddress?: string;
  commonShippingMethod?: string;
  customer?: string;
  user?: string;
  discounts?: {
    dynamicMessages?: string[];
    shippingBasedDiscounts?: string[];
    valueBasedDiscounts?: string[];
  };
  buckets?: string[];
  basketExtensions?: BasketExtension[];
  lineItems?: string[];
  payments?: string[];
  promotionCodes?: string[];
  totals: BasketTotalData;
  totalProductQuantity?: number;
  surcharges?: {
    itemSurcharges?: {
      amount: PriceItemData;
      description: string;
      name: string;
    }[];
    bucketSurcharges?: {
      amount: PriceItemData;
      description: string;
      name: string;
    }[];
  };
  approval?: BasketApproval;
  attributes?: Attribute[];
  externalOrderReference?: string;
}

export interface BasketData {
  data: BasketBaseData;
  included?: {
    invoiceToAddress?: { [urn: string]: AddressData };
    lineItems?: { [id: string]: LineItemData };
    discounts?: { [id: string]: BasketRebateData };
    lineItems_discounts?: { [id: string]: BasketRebateData };
    commonShipToAddress?: { [urn: string]: AddressData };
    commonShippingMethod?: { [id: string]: ShippingMethodData };
    payments?: { [id: string]: PaymentData };
    payments_paymentMethod?: { [id: string]: PaymentMethodBaseData };
    payments_paymentInstrument?: { [id: string]: PaymentInstrument };
    camfilProductLineItems?: { [id: string]: CamfilLineItemData };
  };
  infos?: BasketInfo[];
}

export interface BasketExtension {
  type?: string;
  name?: string;
  customer?: CamCardCustomer;
  contactPerson?: CamCardContact;
  info?: string;
  phoneNumber?: string;
  isPartial?: boolean;
  orderMark?: string;
  invoiceLabel?: string;
  deliveryAddress?: Address;
  shippingAddress?: Address;
  invoiceAddress?: Address;
  deliveryDate?: string;
  isPartialDelivery?: boolean;
  createdFromCamCardId?: string;
  emailRecipients?: string[];
  volumeDiscount?: number;
  // Additional for France
  anonymousBasketDataRO?: GuestBasketData;
}

export interface GuestBasketData {
  firstName: string;
  lastName: string;
  emailAddress: string;
  phoneNumber: string;
  dlvGoodsMark?: string;
  dlvInvoiceMark?: string;
  companyName?: string;
  vatNumber?: string;
  siretNumber?: string;
  jobTitle?: string;
  dlvInfo?: string;
  dlvNote?: string;
  dlvStreetAddress: string;
  dlvZipCode: string;
  dlvCity: string;
  dlvCountry: string;
  invStreetAddress?: string;
  invZipCode?: string;
  invCity?: string;
  invCountry?: string;
}

export interface GuestBasket {
  userDetailsFormGroup: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    siret: string;
    companyName: string;
    jobTitle: string;
    vat: string;
  };
  deliveryInfoFromGroup: {
    boxLabel: string;
    invoiceMark: string;
    deliveryInfo: string;
    customerNote: string;
    streetAddress: string;
    zipCode: string;
    city: string;
    country: string;
    sameAddressAsInvoice: boolean;
  };
  invoiceAddressFormGroup: {
    streetAddress: string;
    zipCode: string;
    city: string;
    country: string;
  };
}
