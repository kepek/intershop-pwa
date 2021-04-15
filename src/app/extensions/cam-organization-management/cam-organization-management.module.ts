import { NgModule } from '@angular/core';

import { SharedModule } from 'ish-shared/shared.module';

import { CamfilOrganizationRolesNamesComponent } from './components/camfil-organization-roles-names/camfil-organization-roles-names.component';
import { CamfilOrganizationCustomerUserContactFormComponent } from './components/camfil-organization-user-customers-form/camfil-organization-customer-user-contact-form.component';
import { CamfilOrganizationUserDetailsFormComponent } from './components/camfil-organization-user-details-form/camfil-organization-user-details-form.component';
import { CamfilOrganizationUserRolesFormComponent } from './components/camfil-organization-user-roles-form/camfil-organization-user-roles-form.component';
import { CamfilOrganizationUsersListToolbarComponent } from './components/camfil-organization-users-list-filters/camfil-organization-users-list-toolbar.component';
import { CamfilOrganizationUsersListComponent } from './components/camfil-organization-users-list/camfil-organization-users-list.component';
import { CamfilConfirmationModalComponent } from './components/camfil-user-customers-selection/camfil-confirmation-moda/camfil-confirmation-modal.component';
import { CamfilUserProfileFormComponent } from './components/camfil-user-profile-form/camfil-user-profile-form.component';
import { CamfilUserRolesSelectionComponent } from './components/camfil-user-roles-selection/camfil-user-roles-selection.component';

const exportedComponents = [
  CamfilConfirmationModalComponent,
  CamfilOrganizationCustomerUserContactFormComponent,
  CamfilOrganizationRolesNamesComponent,
  CamfilOrganizationUserDetailsFormComponent,
  CamfilOrganizationUserRolesFormComponent,
  CamfilOrganizationUsersListComponent,
  CamfilOrganizationUsersListToolbarComponent,
  CamfilUserProfileFormComponent,
  CamfilUserRolesSelectionComponent,
];

@NgModule({
  imports: [SharedModule],
  declarations: [...exportedComponents],
  exports: [...exportedComponents],
})
export class CamOrganizationManagementModule {}
