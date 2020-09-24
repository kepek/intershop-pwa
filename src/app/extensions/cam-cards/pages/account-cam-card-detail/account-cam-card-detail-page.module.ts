import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'ish-shared/shared.module';

import { CamCardsModule } from '../../cam-cards.module';

import { AccountCamCardDetailLineItemComponent } from './account-cam-card-detail-line-item/account-cam-card-detail-line-item.component';
import { AccountCamCardDetailPageComponent } from './account-cam-card-detail-page.component';

const accountCamCardDetailPageRoutes: Routes = [
  {
    path: '',
    component: AccountCamCardDetailPageComponent,
  },
];

@NgModule({
  imports: [CamCardsModule, RouterModule.forChild(accountCamCardDetailPageRoutes), SharedModule],
  declarations: [AccountCamCardDetailLineItemComponent, AccountCamCardDetailPageComponent],
})
export class AccountCamCardDetailPageModule {}
