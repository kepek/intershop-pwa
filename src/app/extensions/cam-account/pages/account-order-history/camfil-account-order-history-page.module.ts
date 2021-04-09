import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'ish-shared/shared.module';

import { CamfilAccountOrderHistoryPageComponent } from './camfil-account-order-history-page.component';

const routes: Routes = [
  {
    path: '',
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
      import('../account-order/camfil-account-order-page.module').then(m => m.CamfilAccountOrderPageModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedModule],
  exports: [RouterModule],
  declarations: [CamfilAccountOrderHistoryPageComponent],
})
export class CamfilAccountOrderHistoryPageModule {}
