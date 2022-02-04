import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { SharedModule } from 'ish-shared/shared.module';

import { CamfilRemindPasswordFormComponent } from './camfil-remind-password-form/camfil-remind-password-form.component';
import { CamfilRemindPasswordComponent } from './camfil-remind-password/camfil-remind-password.component';
import { CamfilUpdatePasswordFormComponent } from './camfil-update-password-form/camfil-update-password-form.component';
import { CamfilUpdatePasswordComponent } from './camfil-update-password/camfil-update-password.component';

const routes: Routes = [
  {
    path: '',
    component: CamfilRemindPasswordComponent,
  },
  {
    path: 'updatePassword',
    component: CamfilUpdatePasswordComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedModule, TranslateModule],
  declarations: [
    CamfilRemindPasswordComponent,
    CamfilRemindPasswordFormComponent,
    CamfilUpdatePasswordComponent,
    CamfilUpdatePasswordFormComponent,
  ],
})
export class CamfilForgotPasswordPageModule {}
