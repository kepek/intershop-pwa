import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FeatureToggleGuard } from 'ish-core/feature-toggle.module';
import { AuthGuard } from 'ish-core/guards/auth.guard';

/**
 * routes for the organization management
 *
 * visible for testing
 */
export const routes: Routes = [
  {
    path: '',
    canActivate: [FeatureToggleGuard, AuthGuard],
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
    canActivate: [FeatureToggleGuard, AuthGuard],
    data: {
      feature: 'camOrganizationManagement',
      permission: 'APP_B2B_MANAGE_USERS',
    },
    loadChildren: () => import('./user/user-page.module').then(m => m.UserPageModule),
  },
  {
    path: 'create',
    canActivate: [FeatureToggleGuard, AuthGuard],
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
