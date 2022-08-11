// tslint:disable: ish-ordered-imports ban-specific-imports
import { CdkTableModule } from '@angular/cdk/table';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

import { SharedModule } from 'ish-shared/shared.module';

import { CamRequisitionManagementModule } from '../../cam-requisition-management.module';
import { BuyerPageComponent } from './buyer-page.component';

const buyerPageRoutes: Routes = [{ path: '', pathMatch: 'full', component: BuyerPageComponent }];

@NgModule({
  imports: [
    CamRequisitionManagementModule,
    CdkTableModule,
    NgbNavModule,
    RouterModule.forChild(buyerPageRoutes),
    SharedModule,
  ],
  declarations: [BuyerPageComponent],
  exports: [],
})
export class CamBuyerPageModule {}
