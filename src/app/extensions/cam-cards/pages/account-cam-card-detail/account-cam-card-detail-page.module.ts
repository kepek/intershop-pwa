import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'ish-shared/shared.module';

import { CamCardsModule } from '../../cam-cards.module';

import { AccountCamCardDetailListComponent } from './account-cam-card-detail-list/account-cam-card-detail-list.component';
import { AccountCamCardDetailPageComponent } from './account-cam-card-detail-page.component';
import { AccountCamCardDetailSubTitleComponent } from './account-cam-card-detail-sub-title/account-cam-card-detail-sub-title.component';
import { AccountCamCardDetailToolbarComponent } from './account-cam-card-detail-toolbar/account-cam-card-detail-toolbar.component';
import { ModalAddNewProductComponent } from './modal-add-new-product/modal-add-new-product.component';
import { ModalAddNewSectionComponent } from './modal-add-new-section/modal-add-new-section.component';

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
    AccountCamCardDetailSubTitleComponent,
    AccountCamCardDetailToolbarComponent,
    ModalAddNewProductComponent,
    ModalAddNewSectionComponent,
  ],
})
export class AccountCamCardDetailPageModule {}
