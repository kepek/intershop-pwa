import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from 'ish-core/guards/auth.guard';
import { FeatureToggleGuard } from 'ish-core/guards/feature-toggle.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./account-cam-card/account-cam-card-page.module').then(m => m.AccountCamCardPageModule),
    canActivate: [FeatureToggleGuard, AuthGuard],
    data: { feature: 'camCards', breadcrumbData: [{ key: 'camfil.account.cam_cards.link' }] },
  },
  {
    path: ':camCardName',
    loadChildren: () =>
      import('./account-cam-card-detail/account-cam-card-detail-page.module').then(
        m => m.AccountCamCardDetailPageModule
      ),
    canActivate: [FeatureToggleGuard, AuthGuard],
    data: { feature: 'camCards' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CamCardsRoutingModule {}
