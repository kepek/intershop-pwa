import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FeatureToggleGuard } from 'ish-core/feature-toggle.module';
import { AuthGuard } from 'ish-core/guards/auth.guard';

import { FetchCreateUserGuard } from '../guards/fetch-create-user-guard.service';
import { FetchCustomerUserGuard } from '../guards/fetch-customer-user-guard.service';
import { FetchCustomersUsersGuard } from '../guards/fetch-customers-users-guard.service';

/**
 * routes for the organization management
 *
 * visible for testing
 */
export const routes: Routes = [
  {
    path: '',
    canActivate: [FeatureToggleGuard, AuthGuard, FetchCustomersUsersGuard],
    data: {
      feature: 'camOrganizationManagement',
      permission: 'APP_B2B_MANAGE_USERS',
    },
    loadChildren: () => import('./organization/organization-page.module').then(m => m.OrganizationPageModule),
  },

  { path: 'customers', redirectTo: '', pathMatch: 'full' },
  { path: 'customers/:CamfilB2BCustomerId', redirectTo: '', pathMatch: 'full' },
  { path: 'customers/:CamfilB2BCustomerId/users', redirectTo: '', pathMatch: 'full' },
  {
    path: 'customers/:CamfilB2BCustomerId/users/:CamfilB2BUserId',
    canActivate: [FeatureToggleGuard, AuthGuard, FetchCustomerUserGuard],
    data: {
      feature: 'camOrganizationManagement',
      permission: 'APP_B2B_MANAGE_USERS',
    },
    loadChildren: () => import('./user/user-page.module').then(m => m.UserPageModule),
  },
  {
    path: 'create',
    canActivate: [FeatureToggleGuard, AuthGuard, FetchCreateUserGuard],
    data: {
      feature: 'camOrganizationManagement',
      permission: 'APP_B2B_MANAGE_USERS',
    },
    loadChildren: () => import('./create/create-page.module').then(m => m.CreatePageModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
})
export class CamOrganizationManagementRoutingModule {}
