import { Address } from 'ish-core/models/address/address.model';
import { BasketExtensions } from 'ish-core/models/basket/basket.interface';
import { CustomerData } from 'ish-core/models/customer/customer.interface';
import { Customer } from 'ish-core/models/customer/customer.model';
import { SelectOption } from 'ish-shared/forms/components/select/select.component';

import { MaintenanceStatus } from './cam-card.helper';

export interface CamCardHeader {
  name: string;
}

export interface CamCard extends CamCardHeader {
  // TODO: make extends form CamCardData and simplify data later + compare fields
  id?: string;
  orderLabel?: string;
  invoiceLabel?: string;
  customerId?: string;
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
  measurement?: CamCardMeasurement;
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
  fullName?: string;
}

export interface CamCardItemComment {
  label: string;
  text?: string;
}

// tslint:disable-next-line:no-empty-interface
export interface CamCardAddress extends Address {
  street?: string;
}

export interface SelectCamCardOption extends SelectOption {
  nextDelivery: string;
  orderLabel?: string;
  invoiceLabel?: string;
  deliveryAddressDisplay?: string;
  deliveryAddress?: CamCardAddress;
  subCamCards?: CamCard[];
  boxLabels?: string[];
  camCardItems?: CamCardItem[];
  customer: CamCardCustomer;
  name: string;
}

export interface CreateCamCardData {
  camCard: CamCard;
  quantity?: number;
  boxLabel?: string;
  edit?: boolean;
  subCamCard?: CamCard;
  measurement?: CamCardMeasurement;
}

export interface CamCamProductChecked {
  camCardId: string;
  camCardRoot: string;
  sku: string;
  quantity: number;
  boxLabel?: string;
  measurement?: CamCardMeasurement;
}

export interface CamCamProductsAddToCartItems {
  products: CamCamProductChecked[];
  extensions?: BasketExtensions;
  address?: Address;
}

export interface CamCamProductsAddToCart {
  [id: string]: CamCamProductsAddToCartItems;
}

export interface CamCardMeasurement {
  [key: string]: number;
}
