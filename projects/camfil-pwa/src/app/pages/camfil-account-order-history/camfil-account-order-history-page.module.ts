import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CamfilOrderListComponent } from 'camfil-pwa/components/camfil-order-list/camfil-order-list.component';

import { SharedModule } from 'ish-shared/shared.module';

import { CamfilAccountOrderHistoryPageComponent } from './camfil-account-order-history-page.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    data: {
      breadcrumbData: [{ key: 'account.order_history.link', link: '/account/orders' }],
    },
    component: CamfilAccountOrderHistoryPageComponent,
  },
  {
    path: ':orderId',
    data: {
      breadcrumbData: [{ key: 'account.order_history.link', link: '/account/orders' }],
    },
    loadChildren: () =>
      import('../camfil-account-order/camfil-account-order-page.module').then(m => m.CamfilAccountOrderPageModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedModule],
  exports: [RouterModule],
  declarations: [CamfilAccountOrderHistoryPageComponent, CamfilOrderListComponent],
})
export class CamfilAccountOrderHistoryPageModule {}
