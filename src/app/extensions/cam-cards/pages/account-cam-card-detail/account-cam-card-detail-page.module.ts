import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'ish-shared/shared.module';

import { CamCardsModule } from '../../cam-cards.module';

import { AccountCamCardDetailListComponent } from './account-cam-card-detail-list/account-cam-card-detail-list.component';
import { AccountCamCardDetailPageComponent } from './account-cam-card-detail-page.component';
import { AccountCamCardDetailToolbarComponent } from './account-cam-card-detail-toolbar/account-cam-card-detail-toolbar.component';

const accountCamCardDetailPageRoutes: Routes = [
  {
    path: '',
    component: AccountCamCardDetailPageComponent,
  },
];

@NgModule({
  imports: [CamCardsModule, RouterModule.forChild(accountCamCardDetailPageRoutes), SharedModule],
  declarations: [
    AccountCamCardDetailListComponent,
    AccountCamCardDetailPageComponent,
    AccountCamCardDetailToolbarComponent,
  ],
})
export class AccountCamCardDetailPageModule {}
