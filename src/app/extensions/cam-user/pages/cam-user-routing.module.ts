import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FeatureToggleGuard } from 'ish-core/guards/feature-toggle.guard';

const routes: Routes = [
  {
    path: 'login',
    canActivate: [FeatureToggleGuard],
    data: {
      meta: {
        title: 'camfil.account.apply_form.link',
        robots: 'noindex, nofollow',
      },
      feature: 'camUser',
      breadcrumbData: [{ key: 'camfil.account.apply_form.link' }],
    },
    loadChildren: () => import('./login/login-page.module').then(m => m.LoginPageModule),
  },
  {
    path: 'register',
    pathMatch: 'full',
    canActivate: [FeatureToggleGuard],
    data: {
      meta: {
        title: 'camfil.account.login_form.link',
        robots: 'noindex, nofollow',
      },
      feature: 'camUser',
      breadcrumbData: [{ key: 'camfil.account.apply_form.link' }],
    },
    loadChildren: () => import('./register/register-page.module').then(m => m.RegisterPageModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CamUserRoutingModule {}
