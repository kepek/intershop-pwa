import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'ish-shared/shared.module';

import { CamCardsModule } from '../../cam-cards.module';

import { AccountCamCardListComponent } from './account-cam-card-list/account-cam-card-list.component';
import { AccountCamCardPageComponent } from './account-cam-card-page.component';

const accountCamCardPageRoutes: Routes = [
  {
    path: '',
    component: AccountCamCardPageComponent,
  },
];

@NgModule({
  imports: [CamCardsModule, RouterModule.forChild(accountCamCardPageRoutes), SharedModule],
  declarations: [AccountCamCardListComponent, AccountCamCardPageComponent],
})
export class AccountCamCardPageModule {}
