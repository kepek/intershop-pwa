import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthorizationToggleGuard } from 'ish-core/authorization-toggle.module';
import { SharedModule } from 'ish-shared/shared.module';

import { CamfilAccountNavigationComponent } from './camfil-account-navigation/camfil-account-navigation.component';
import { CamfilAccountPageComponent } from './camfil-account-page.component';

const routes: Routes = [
  {
    path: '',
    component: CamfilAccountPageComponent,
    data: {
      breadcrumbData: [],
    },
    children: [
      // Redirect /account to /account/profile
      { path: '', redirectTo: 'profile', pathMatch: 'full' },
      // Redirect below routes to /account
      { path: 'addresses', redirectTo: '/account' },
      { path: 'payment', redirectTo: '/account' },
      { path: 'wishlists', redirectTo: '/account' },
      { path: 'order-templates', redirectTo: '/account' },
      {
        path: 'profile',
        loadChildren: () =>
          import('../camfil-account-profile/camfil-account-profile-page.module').then(
            m => m.CamfilAccountProfilePageModule
          ),
      },
      {
        path: 'camcards',
        loadChildren: () =>
          import('../../../../../../src/app/extensions/cam-cards/pages/cam-cards-routing.module').then(
            m => m.CamCardsRoutingModule
          ),
      },
      {
        path: 'orders',
        loadChildren: () =>
          import('../camfil-account-order-history/camfil-account-order-history-page.module').then(
            m => m.CamfilAccountOrderHistoryPageModule
          ),
      },
      {
        path: 'quotes',
        loadChildren: () =>
          import('../../../../../../src/app/extensions/cam-quotes/cam-quotes.module').then(m => m.CamQuotesModule),
      },
      {
        path: 'organization',
        loadChildren: () =>
          import(
            '../../../../../../src/app/extensions/cam-organization-management/pages/cam-organization-management-routing.module'
          ).then(m => m.CamOrganizationManagementRoutingModule),
        canActivate: [AuthorizationToggleGuard],
        data: {
          permission: 'APP_B2B_MANAGE_USERS',
        },
      },
      {
        path: 'requisitions',
        loadChildren: () =>
          import(
            '../../../../../../src/app/extensions/cam-requisition-management/pages/cam-requisition-management-routing.module'
          ).then(m => m.CamRequisitionManagementRoutingModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedModule],
  declarations: [CamfilAccountNavigationComponent, CamfilAccountPageComponent],
})
export class CamfilAccountPageModule {}
