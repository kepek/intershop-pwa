import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'ish-shared/shared.module';

import { CamfilAccountOrderPageComponent } from './camfil-account-order-page.component';
import { CamfilAccountOrderComponent } from './camfil-account-order/camfil-account-order.component';

const routes: Routes = [
  {
    path: '',
    component: CamfilAccountOrderPageComponent,
    children: [
      {
        path: '**',
        component: CamfilAccountOrderPageComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedModule],
  declarations: [CamfilAccountOrderComponent, CamfilAccountOrderPageComponent],
})
export class CamfilAccountOrderPageModule {}
