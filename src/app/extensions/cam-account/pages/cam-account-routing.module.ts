import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from 'ish-core/guards/auth.guard';
import { FeatureToggleGuard } from 'ish-core/guards/feature-toggle.guard';

const routes: Routes = [
  {
    path: 'account',
    loadChildren: () => import('./account/camfil-account-page.module').then(m => m.CamfilAccountPageModule),
    canActivate: [AuthGuard],
    data: {
      meta: {
        title: 'account.my_account.heading',
        robots: 'noindex, nofollow',
      },
      feature: 'camAccount',
      breadcrumbData: [],
    },
  },
  {
    path: 'login',
    canActivate: [FeatureToggleGuard],
    data: {
      meta: {
        robots: 'noindex, nofollow',
      },
      feature: 'camAccount',
      breadcrumbData: [],
    },
    loadChildren: () => import('./login/camfil-login-page.module').then(m => m.CamfilLoginPageModule),
  },
  {
    path: 'register',
    pathMatch: 'full',
    canActivate: [FeatureToggleGuard],
    data: {
      meta: {
        robots: 'noindex, nofollow',
      },
      feature: 'camAccount',
      breadcrumbData: [],
    },
    loadChildren: () => import('./register/camfil-register-page.module').then(m => m.CamfilRegisterPageModule),
  },

  {
    path: 'forgotPassword',
    canActivate: [FeatureToggleGuard],
    data: {
      feature: 'camAccount',
      breadcrumbData: [],
    },
    loadChildren: () =>
      import('./forgot-password/camfil-forgot-password-page.module').then(m => m.CamfilForgotPasswordPageModule),
  },

  {
    path: 'forgotUsername',
    canActivate: [FeatureToggleGuard],
    data: {
      feature: 'camAccount',
      breadcrumbData: [],
    },
    loadChildren: () =>
      import('./forgot-username/camfil-forgot-username-page.module').then(m => m.CamfilForgotUsernamePageModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CamAccountRoutingModule {}
