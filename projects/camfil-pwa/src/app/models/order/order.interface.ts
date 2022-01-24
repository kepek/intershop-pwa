import { AddressData } from 'ish-core/models/address/address.interface';

export enum GuestAttributePrefix {
  CustomerId = 'CAMFIL_CUSTOMER_ID',
  Default = 'CAMFIL_ANON_',
  DeliveryDate = 'CAMFIL_DELIVERY_DATE',
  EmailRecipients = 'CAMFIL_EMAIL_RECIPIENTS',
  ErpId = 'CAMFIL_CONTACT_ERPID',
  InvoiceAddress = 'CAMFIL_ANON_INV_',
  ShippingAddress = 'CAMFIL_ANON_DLV_',
  TaxationID = 'CAMFIL_ANON_VAT_NUMBER',
  VolumeDiscount = 'CAMFIL_VOLUME_DISCOUNT',
}

export interface GuestBuyer extends Partial<AddressData> {
  goodsMark?: string;
  info?: string;
  jobTitle?: string;
  origin?: boolean;
  taxationID?: string;
}
