import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'approver',
    data: {
      feature: 'camRequisitionManagement',
    },
    loadChildren: () => import('./approver/cam-approver-page.module').then(m => m.CamApproverPageModule),
  },
  {
    path: 'buyer',
    data: {
      feature: 'camRequisitionManagement',
    },
    loadChildren: () => import('./buyer/cam-buyer-page.module').then(m => m.CamBuyerPageModule),
  },
  {
    path: 'approver/:requisitionId',
    data: {
      feature: 'camRequisitionManagement',
    },
    loadChildren: () =>
      import('./requisition-detail/cam-requisition-detail-page.module').then(m => m.CamRequisitionDetailPageModule),
  },
  {
    path: 'buyer/:requisitionId',
    data: {
      feature: 'camRequisitionManagement',
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
