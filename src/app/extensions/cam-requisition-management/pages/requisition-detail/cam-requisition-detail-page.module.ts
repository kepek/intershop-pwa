// tslint:disable: ish-ordered-imports ban-specific-imports
import { CdkTableModule } from '@angular/cdk/table';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

import { SharedModule } from 'ish-shared/shared.module';

import { CamRequisitionManagementModule } from '../../cam-requisition-management.module';
import { RequisitionDetailPageComponent } from './requisition-detail-page.component';

const requisitionDetailPageRoutes: Routes = [
  { path: '', pathMatch: 'full', component: RequisitionDetailPageComponent },
];

@NgModule({
  imports: [
    CamRequisitionManagementModule,
    CdkTableModule,
    NgbNavModule,
    RouterModule.forChild(requisitionDetailPageRoutes),
    SharedModule,
  ],
  declarations: [RequisitionDetailPageComponent],
  exports: [],
})
export class CamRequisitionDetailPageModule {}
