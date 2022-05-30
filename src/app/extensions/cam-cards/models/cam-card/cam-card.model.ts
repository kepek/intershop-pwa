import { Address } from 'ish-core/models/address/address.model';
import { BasketExtension } from 'ish-core/models/basket-extension/basket-extension.model';
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
  erpId?: string;
}

export interface CamCardItem {
  id?: string;
  quantity: number;
  position?: number;
  product: CamCardProduct;
  creationDate?: number;
  comment?: CamCardItemComment;
  measurement?: CamCardMeasurement;
  lastDeliveryDate?: string;
  deliveryInterval?: number;
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
  department?: string;
  parent?: boolean;
}

export interface CamCardCustomerData extends CustomerData {
  id: string;
  department?: string;
  parent?: boolean;
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

export interface CamCardCustomersAddresses {
  [customerId: string]: CamCardAddress[];
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
  camCardErpId: boolean;
  camCardRoot: string;
  sku: string;
  quantity: number;
  boxLabel?: string;
  measurement?: CamCardMeasurement;
}

export interface CamCamProductsAddToCartItems {
  products: CamCamProductChecked[];
  extensions?: BasketExtension;
  address?: Address;
  allProductsSelected?: boolean;
}

export interface CamCamProductsAddToCart {
  [id: string]: CamCamProductsAddToCartItems;
}

export interface CamCardMeasurement {
  [key: string]: number | boolean;
  valid?: boolean;
}

export interface CamCardImportValidationResponse {
  boxLabel?: string;
  camCardLines: CamCardValidationLine[];
  camCardName?: string;
  customerNumber?: string;
  customerRecipientName?: string;
  deliveryAddressBuilding?: string;
  deliveryAddressCity?: string;
  deliveryAddressCountryCode?: string;
  deliveryAddressStreet?: string;
  deliveryAddressZipCode?: string;
  deliveryInterval?: number;
  errors: [];
  invoiceMark?: string;
  name?: string;
  orderMark?: string;
  originalLineNumber?: number;
  type?: string;
}

export interface CamCardValidationLine {
  errors: CamCardLineValidationError[];
  name?: string;
  originalLineNumber?: number;
  quantity?: number;
  sku?: string;
  type?: string;
}

export interface CamCardLineValidationError {
  errorCode: string;
  errorParameters: string[];
  name: string;
  type: string;
}
