import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { ActionReducerMap, StoreModule } from '@ngrx/store';
import { pick } from 'lodash-es';

import { resetOnLogoutMeta } from 'ish-core/utils/meta-reducers';

import { CamOrganizationManagementState } from './cam-organization-management-store';
import { ContactEffects } from './contact/contact.effects';
import { contactReducer } from './contact/contact.reducer';
import { CustomerEffects } from './customer/customer.effects';
import { customerReducer } from './customer/customer.reducer';
import { RoleEffects } from './role/role.effects';
import { roleReducer } from './role/role.reducer';
import { UserEffects } from './user/user.effects';
import { userReducer } from './user/user.reducer';

const camOrganizationManagementReducers: ActionReducerMap<CamOrganizationManagementState> = {
  contacts: contactReducer,
  customers: customerReducer,
  users: userReducer,
  roles: roleReducer,
};

const camOrganizationManagementEffects = [ContactEffects, CustomerEffects, RoleEffects, UserEffects];

const metaReducers = [resetOnLogoutMeta];

// not-dead-code
@NgModule({
  imports: [
    EffectsModule.forFeature(camOrganizationManagementEffects),
    StoreModule.forFeature('camOrganizationManagement', camOrganizationManagementReducers, { metaReducers }),
  ],
})
export class CamOrganizationManagementStoreModule {
  static forTesting(...reducers: (keyof ActionReducerMap<CamOrganizationManagementState>)[]) {
    return StoreModule.forFeature('camOrganizationManagement', pick(camOrganizationManagementReducers, reducers));
  }
}
