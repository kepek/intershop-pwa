import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthorizationToggleGuard } from 'ish-core/authorization-toggle.module';
import { SharedModule } from 'ish-shared/shared.module';

import { CamfilAccountNavigationComponent } from './camfil-account-navigation/camfil-account-navigation.component';
import { CamfilAccountPageComponent } from './camfil-account-page.component';

const accountPageRoutes: Routes = [
  {
    path: '',
    component: CamfilAccountPageComponent,
    children: [
      // Redirect /account to /account/profile
      { path: '', redirectTo: 'profile', pathMatch: 'full' },
      // Redirect below routes to /account
      { path: 'addresses', redirectTo: '/account' },
      { path: 'payment', redirectTo: '/account' },
      { path: 'quotes', redirectTo: '/account' },
      { path: 'wishlists', redirectTo: '/account' },
      { path: 'order-templates', redirectTo: '/account' },
      { path: 'requisitions', redirectTo: '/account' },
      {
        path: 'profile',
        data: { breadcrumbData: [{ key: 'camfil.account.profile.link' }] },
        loadChildren: () =>
          import('../account-profile/camfil-account-profile-page.module').then(m => m.CamfilAccountProfilePageModule),
      },
      {
        path: 'camcards',
        data: { breadcrumbData: [{ key: 'camfil.account.camcards.link' }] },
        loadChildren: () =>
          import('../../../cam-cards/pages/cam-cards-routing.module').then(m => m.CamCardsRoutingModule),
      },
      {
        path: 'orders',
        data: { breadcrumbData: [{ key: 'account.order_history.link' }] },
        loadChildren: () =>
          import('../../../cam-account/pages/account-order-history/camfil-account-order-history-page.module').then(
            m => m.CamfilAccountOrderHistoryPageModule
          ),
      },
      {
        path: 'organization',
        // TODO (extMlk): To be replaced with `cam-organization` extension module in the next days...
        loadChildren: () => import('organization-management').then(m => m.OrganizationManagementModule),
        canActivate: [AuthorizationToggleGuard],
        data: {
          breadcrumbData: [{ key: 'camfil.account.organization.user_management' }],
          permission: 'APP_B2B_MANAGE_USERS',
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(accountPageRoutes), SharedModule],
  declarations: [CamfilAccountNavigationComponent, CamfilAccountPageComponent],
})
export class CamfilAccountPageModule {}
