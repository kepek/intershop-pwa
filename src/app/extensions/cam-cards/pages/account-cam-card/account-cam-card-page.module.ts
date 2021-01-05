import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'ish-shared/shared.module';

import { CamCardsModule } from '../../cam-cards.module';

import { AccountCamCardListComponent } from './account-cam-card-list/account-cam-card-list.component';
import { AccountCamCardPageComponent } from './account-cam-card-page.component';
import { AccountCamCardPdfComponent } from './account-cam-card-pdf/account-cam-card-pdf.component';
import { AccountCamCardToolbarComponent } from './account-cam-card-toolbar/account-cam-card-toolbar.component';
import { CamfilCamCardsSearchComponent } from './camfil-cam-cards-search/camfil-cam-cards-search.component';

const accountCamCardPageRoutes: Routes = [
  {
    path: '',
    component: AccountCamCardPageComponent,
  },
];

@NgModule({
  imports: [CamCardsModule, RouterModule.forChild(accountCamCardPageRoutes), SharedModule],
  declarations: [
    AccountCamCardListComponent,
    AccountCamCardPageComponent,
    AccountCamCardPdfComponent,
    AccountCamCardToolbarComponent,
    CamfilCamCardsSearchComponent,
  ],
})
export class AccountCamCardPageModule {}
