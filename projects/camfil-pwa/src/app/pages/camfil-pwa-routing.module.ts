import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from 'ish-core/guards/auth.guard';
import { IdentityProviderLoginGuard } from 'ish-core/guards/identity-provider-login.guard';
import { IdentityProviderRegisterGuard } from 'ish-core/guards/identity-provider-register.guard';

const routes: Routes = [
  {
    path: 'login-on-behalf',
    loadChildren: () =>
      import('../pages/camfil-login-on-behalf/camfil-login-on-behalf-page.module').then(
        m => m.CamfilLoginOnBehalfPageModule
      ),
    canActivate: [IdentityProviderLoginGuard],
    data: {
      meta: {
        robots: 'noindex, nofollow',
      },
      breadcrumbData: [],
    },
  },
  {
    path: 'account',
    loadChildren: () =>
      import('../pages/camfil-account/camfil-account-page.module').then(m => m.CamfilAccountPageModule),
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    data: {
      meta: {
        title: 'account.my_account.heading',
        robots: 'noindex, nofollow',
      },
      breadcrumbData: [],
    },
  },
  {
    path: 'login',
    canActivate: [IdentityProviderLoginGuard],
    data: {
      meta: {
        robots: 'noindex, nofollow',
      },
      breadcrumbData: [],
    },
    loadChildren: () => import('../pages/camfil-login/camfil-login-page.module').then(m => m.CamfilLoginPageModule),
  },
  {
    path: 'register',
    pathMatch: 'full',
    canActivate: [IdentityProviderRegisterGuard],
    data: {
      meta: {
        robots: 'noindex, nofollow',
      },
      breadcrumbData: [],
    },
    loadChildren: () =>
      import('../pages/camfil-register/camfil-register-page.module').then(m => m.CamfilRegisterPageModule),
  },

  {
    path: 'forgotPassword',
    data: {
      breadcrumbData: [],
    },
    loadChildren: () =>
      import('../pages/camfil-forgot-password/camfil-forgot-password-page.module').then(
        m => m.CamfilForgotPasswordPageModule
      ),
  },

  {
    path: 'forgotUsername',
    data: {
      breadcrumbData: [],
    },
    loadChildren: () =>
      import('../pages/camfil-forgot-username/camfil-forgot-username-page.module').then(
        m => m.CamfilForgotUsernamePageModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CamfilPwaRoutingModule {}
