import { createFeatureSelector } from '@ngrx/store';

import { ContactState } from './contact/contact.reducer';
import { CustomerState } from './customer/customer.reducer';
import { RoleState } from './role/role.reducer';
import { UserState } from './user/user.reducer';

export interface CamOrganizationManagementState {
  contacts: ContactState;
  customers: CustomerState;
  roles: RoleState;
  users: UserState;
}

export const getCamOrganizationManagementState = createFeatureSelector<CamOrganizationManagementState>(
  'camOrganizationManagement'
);
