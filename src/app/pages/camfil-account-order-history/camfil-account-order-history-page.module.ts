import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'ish-shared/shared.module';

import { CamfilAccountOrderHistoryPageComponent } from './camfil-account-order-history-page.component';

const routes: Routes = [
  { path: '', component: CamfilAccountOrderHistoryPageComponent },
  {
    path: ':orderId',
    data: {
      breadcrumbData: [{ key: 'account.order_history.link', link: '/account/orders' }],
    },
    loadChildren: () => import('../account-order/account-order-page.module').then(m => m.AccountOrderPageModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedModule],
  exports: [RouterModule],
  declarations: [CamfilAccountOrderHistoryPageComponent],
})
export class AccountOrderHistoryPageModule {}
