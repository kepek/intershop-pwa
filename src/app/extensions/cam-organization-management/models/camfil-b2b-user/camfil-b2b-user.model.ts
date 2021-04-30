// tslint:disable: ish-ordered-imports ban-specific-imports
import { B2bUser } from '../../../../../../projects/organization-management/src/app/models/b2b-user/b2b-user.model';
import { CamfilB2bCustomer } from '../camfil-b2b-customer/camfil-b2b-customer.model';

export interface CamfilB2bUserRelations {
  customerId?: string;
  contactId?: string;
  roleIDs?: string[];
  customers?: CamfilB2bCustomer[];
}

export const camfilB2bUserRelationsKeys = ['roleIDs'];

export interface CamfilB2bUser extends B2bUser, CamfilB2bUserRelations {
  id: string;
  currentLogin?: string;
}

export type CamfilB2bUserKeys = keyof CamfilB2bUser;
