// tslint:disable: ish-ordered-imports ban-specific-imports
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';

import { SharedModule } from 'ish-shared/shared.module';

import { CamRequisitionManagementModule } from '../../cam-requisition-management.module';
import { ApproverPageComponent } from './approver-page.component';

const approverPageRoutes: Routes = [{ path: '', pathMatch: 'full', component: ApproverPageComponent }];

@NgModule({
  imports: [CamRequisitionManagementModule, NgbNavModule, RouterModule.forChild(approverPageRoutes), SharedModule],
  declarations: [ApproverPageComponent],
  exports: [],
})
export class CamApproverPageModule {}
