import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginGuard } from 'ish-core/guards/login.guard';
import { SharedModule } from 'ish-shared/shared.module';

import { MaterialModule } from '../../../../projects/camfil/src/app/shared/material/material.module';
import { CamfilDetailsBoxComponent } from '../../shared/components/common/camfil-details-box/camfil-details-box.component';

import { CamfilLoginFormComponent } from './camfil-login-form/camfil-login-form.component';
import { CamfilLoginInfoSectionComponent } from './camfil-login-info-section/camfil-login-info-section.component';
import { CamfilLoginNewCustomerComponent } from './camfil-login-new-customer/camfil-login-new-customer.component';
import { CamfilLoginPageComponent } from './camfil-login-page.component';

const loginPageRoutes: Routes = [
  {
    path: '',
    component: CamfilLoginPageComponent,
    canActivate: [LoginGuard],
    data: {
      meta: {
        title: 'account.login.link',
        robots: 'noindex, nofollow',
      },
    },
  },
];

@NgModule({
  imports: [MaterialModule, RouterModule.forChild(loginPageRoutes), SharedModule],
  declarations: [
    CamfilDetailsBoxComponent,
    CamfilLoginFormComponent,
    CamfilLoginInfoSectionComponent,
    CamfilLoginNewCustomerComponent,
    CamfilLoginPageComponent,
  ],
})
export class CamfilLoginPageModule {}
