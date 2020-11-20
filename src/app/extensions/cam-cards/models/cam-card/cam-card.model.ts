import { Address } from 'ish-core/models/address/address.model';
import { CustomerData } from 'ish-core/models/customer/customer.interface';
import { Customer } from 'ish-core/models/customer/customer.model';

import { MaintenanceStatus } from './cam-card.helper';

export interface CamCardHeader {
  name: string;
}

export interface CamCard extends CamCardHeader {
  // TODO: make extends form CamCardData and simplify data later + compare fields
  id?: string;
  orderLabel?: string;
  invoiceLabel?: string;
  customer?: CamCardCustomer;
  rootCamCard?: string; // TODO: id from root
  subCamCards?: CamCard[];
  camCardItems?: CamCardItem[]; // was items
  itemsCount?: number;
  creationDate?: Date;
  contacts?: CamCardContact[];
  maintenanceStatus?: MaintenanceStatus;
  deliveryAddress?: CamCardAddress;
  nextDeliveryDate?: string;
  lastDeliveryDate?: string;
  deliveryInterval?: number;
  reminderFlag?: number;
  transient?: boolean;
}

export interface CamCardItem {
  id?: string;
  quantity: number;
  position?: number;
  product: CamCardProduct;
  creationDate?: number;
  comment?: CamCardItemComment;
}

export interface CamCardProduct {
  sku: string;
  name?: string;
  shortDescription?: string;
  longDescription?: string;
  available?: boolean;
}

export interface CamCardCustomer extends Customer {
  id: string;
}

export interface CamCardCustomerData extends CustomerData {
  id: string;
}

export interface CamCardContact {
  profileId?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  erpId?: string;
}

export interface CamCardItemComment {
  label: string;
  text: string;
}

// tslint:disable-next-line:no-empty-interface
export interface CamCardAddress extends Address {
  street?: string;
}
