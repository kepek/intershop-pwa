import { Address } from 'ish-core/models/address/address.model';
import { Customer } from 'ish-core/models/customer/customer.model';

import { CamfilB2bContact } from '../camfil-b2b-contact/camfil-b2b-contact.model';

export interface CamfilB2bCustomerRelations {
  contactIDs?: string[];
  roleIDs?: string[];
  userIDs?: string[];
  contacts?: CamfilB2bContact[];
  userContact?: CamfilB2bContact;
}

export const camfilB2bCustomerRelationsKeys = ['contactIDs', 'roleIDs', 'userIDs'];

export interface CamfilB2bCustomer extends Customer, CamfilB2bCustomerRelations {
  id: string;
  parent: boolean;
  preferredInvoiceToAddress: Address;
  department?: string;
}

export interface CamfilB2bCustomerContact {
  customer: CamfilB2bCustomer;
  contact: CamfilB2bContact;
}
