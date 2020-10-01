import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IconModule } from 'camfil-shared/icon/icon.module';
import { MaterialModule } from 'camfil-shared/material/material.module';

import { SharedModule } from 'ish-shared/shared.module';

import { CamCardsModule } from '../../cam-cards.module';

import { AccountCamCardListComponent } from './account-cam-card-list/account-cam-card-list.component';
import { AccountCamCardPageComponent } from './account-cam-card-page.component';
import { AccountCamCardToolbarComponent } from './account-cam-card-toolbar/account-cam-card-toolbar.component';
import { CamfilCamCardsSearchComponent } from './camfil-cam-cards-search/camfil-cam-cards-search.component';

const accountCamCardPageRoutes: Routes = [
  {
    path: '',
    component: AccountCamCardPageComponent,
  },
];

@NgModule({
  imports: [CamCardsModule, IconModule, MaterialModule, RouterModule.forChild(accountCamCardPageRoutes), SharedModule],
  declarations: [
    AccountCamCardListComponent,
    AccountCamCardPageComponent,
    AccountCamCardToolbarComponent,
    CamfilCamCardsSearchComponent,
  ],
})
export class AccountCamCardPageModule {}
