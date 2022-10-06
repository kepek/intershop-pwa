import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FeatureToggleGuard } from 'ish-core/feature-toggle.module';

const routes: Routes = [
  {
    path: 'approver',
    canActivate: [FeatureToggleGuard],
    data: {
      feature: 'camRequisitionManagement',
    },
    loadChildren: () => import('./approver/cam-approver-page.module').then(m => m.CamApproverPageModule),
  },
  {
    path: 'buyer',
    canActivate: [FeatureToggleGuard],
    data: {
      feature: 'camRequisitionManagement',
    },
    loadChildren: () => import('./buyer/cam-buyer-page.module').then(m => m.CamBuyerPageModule),
  },
  {
    path: 'approver/:requisitionId',
    canActivate: [FeatureToggleGuard],
    data: {
      feature: 'camRequisitionManagement',
    },
    loadChildren: () =>
      import('./requisition-detail/cam-requisition-detail-page.module').then(m => m.CamRequisitionDetailPageModule),
  },
  {
    path: 'buyer/:requisitionId',
    canActivate: [FeatureToggleGuard],
    data: {
      feature: 'camRequisitionManagement',
      breadcrumbData: [{ key: 'account.requisitions.approval.link' }],
    },
    loadChildren: () =>
      import('./requisition-detail/cam-requisition-detail-page.module').then(m => m.CamRequisitionDetailPageModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CamRequisitionManagementRoutingModule {}
