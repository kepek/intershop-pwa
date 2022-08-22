// tslint:disable: no-console ish-ordered-imports project-structure ban-specific-imports

import { Address } from 'ish-core/models/address/address.model';

import { CamCardContact, CamCardCustomer } from '../../../extensions/cam-cards/models/cam-card/cam-card.model';
import { Price } from 'ish-core/models/price/price.model';

export interface BasketExtensionGuestData {
  type?: string;
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

export interface BasketExtensionData {
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
  volumeDiscount?: Price;
  freightCostInvalid?: boolean;
  // Additional for France
  anonymousBasketData?: BasketExtensionGuestData;
}
