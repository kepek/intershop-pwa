import { CustomerData } from 'ish-core/models/customer/customer.interface';

import { CamfilB2bContactData } from '../camfil-b2b-contact/camfil-b2b-contact.interface';

import { CamfilB2bCustomer } from './camfil-b2b-customer.model';

export interface CamfilB2bCustomerDataRelations {
  contacts?: CamfilB2bContactData[];
  userContact?: CamfilB2bContactData;
}

export interface CamfilB2bCustomerData extends CustomerData, CamfilB2bCustomerDataRelations {
  id: string;
  parent: boolean;
  parentCustomer?: CamfilB2bCustomer;
  department?: string;
}
