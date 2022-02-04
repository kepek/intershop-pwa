import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CamfilDetailsBoxComponent } from 'ish-shared/components/common/camfil-details-box/camfil-details-box.component';
import { SharedModule } from 'ish-shared/shared.module';

import { CamfilLoginFormComponent } from './camfil-login-form/camfil-login-form.component';
import { LoginInfoSectionComponent } from './camfil-login-info-section/login-info-section.component';
import { CamfilLoginNewCustomerComponent } from './camfil-login-new-customer/camfil-login-new-customer.component';
import { CamfilLoginPageComponent } from './camfil-login-page.component';

const routes: Routes = [
  {
    path: '',
    component: CamfilLoginPageComponent,
    data: {
      meta: {
        title: 'account.login.link',
        robots: 'noindex, nofollow',
      },
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedModule],
  declarations: [
    CamfilDetailsBoxComponent,
    CamfilLoginFormComponent,
    CamfilLoginNewCustomerComponent,
    CamfilLoginPageComponent,
    LoginInfoSectionComponent,
  ],
})
export class CamfilLoginPageModule {}
