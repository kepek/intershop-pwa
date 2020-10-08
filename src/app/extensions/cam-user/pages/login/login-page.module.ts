import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CamfilDetailsBoxComponent } from 'ish-shared/components/common/camfil-details-box/camfil-details-box.component';
import { SharedModule } from 'ish-shared/shared.module';

import { LoginFormComponent } from './login-form/login-form.component';
import { LoginInfoSectionComponent } from './login-info-section/login-info-section.component';
import { LoginNewCustomerComponent } from './login-new-customer/login-new-customer.component';
import { LoginPageComponent } from './login-page.component';

const loginPageRoutes: Routes = [
  {
    path: '',
    component: LoginPageComponent,
    data: {
      meta: {
        title: 'account.login.link',
        robots: 'noindex, nofollow',
      },
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(loginPageRoutes), SharedModule],
  declarations: [
    CamfilDetailsBoxComponent,
    LoginFormComponent,
    LoginInfoSectionComponent,
    LoginNewCustomerComponent,
    LoginPageComponent,
  ],
})
export class LoginPageModule {}
