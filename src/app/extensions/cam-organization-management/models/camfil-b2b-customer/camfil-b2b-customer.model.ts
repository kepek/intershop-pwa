import { Address } from 'ish-core/models/address/address.model';
import { Customer } from 'ish-core/models/customer/customer.model';

export interface CamfilB2bCustomerRelations {
  contactIDs?: string[];
  roleIDs?: string[];
  userIDs?: string[];
}

export const camfilB2bCustomerRelationsKeys = ['contactIDs', 'roleIDs', 'userIDs'];

export interface CamfilB2bCustomer extends Customer, CamfilB2bCustomerRelations {
  id: string;
  parent: boolean;
  preferredInvoiceToAddress: Address;
}

export type CamfilB2bCustomerKeys = keyof CamfilB2bCustomer;
