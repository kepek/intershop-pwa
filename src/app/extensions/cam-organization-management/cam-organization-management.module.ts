import { NgModule } from '@angular/core';

import { SharedModule } from 'ish-shared/shared.module';

import { CamfilOrganizationRolesNamesComponent } from './components/camfil-organization-roles-names/camfil-organization-roles-names.component';
import { CamfilOrganizationUserApproversComponent } from './components/camfil-organization-user-approvers/camfil-organization-user-approvers.component';
import { CamfilOrganizationUserCustomerContactFormComponent } from './components/camfil-organization-user-customer-contact-form/camfil-organization-user-customer-contact-form.component';
import { CamfilOrganizationUserDetailsFormComponent } from './components/camfil-organization-user-details-form/camfil-organization-user-details-form.component';
import { CamfilOrganizationUserRolesFormComponent } from './components/camfil-organization-user-roles-form/camfil-organization-user-roles-form.component';
import { CamfilOrganizationUsersListToolbarComponent } from './components/camfil-organization-users-list-filters/camfil-organization-users-list-toolbar.component';
import { CamfilOrganizationUsersListComponent } from './components/camfil-organization-users-list/camfil-organization-users-list.component';

const exportedComponents = [
  CamfilOrganizationRolesNamesComponent,
  CamfilOrganizationUserApproversComponent,
  CamfilOrganizationUserCustomerContactFormComponent,
  CamfilOrganizationUserDetailsFormComponent,
  CamfilOrganizationUserRolesFormComponent,
  CamfilOrganizationUsersListComponent,
  CamfilOrganizationUsersListToolbarComponent,
];

@NgModule({
  imports: [SharedModule],
  declarations: [...exportedComponents],
  exports: [...exportedComponents],
})
export class CamOrganizationManagementModule {}
