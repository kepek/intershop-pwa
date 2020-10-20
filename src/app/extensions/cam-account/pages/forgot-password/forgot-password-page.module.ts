import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { SharedModule } from 'ish-shared/shared.module';

import { CamAccountModule } from '../../cam-account.module';

import { RemindPasswordFormComponent } from './remind-password-form/remind-password-form.component';
import { RemindPasswordComponent } from './remind-password/remind-password.component';
import { UpdatePasswordFormComponent } from './update-password-form/update-password-form.component';
import { UpdatePasswordComponent } from './update-password/update-password.component';

const forgotPasswordPageRoutes: Routes = [
  {
    path: '',
    component: RemindPasswordComponent,
  },
  {
    path: 'updatePassword',
    component: UpdatePasswordComponent,
  },
];

@NgModule({
  imports: [CamAccountModule, RouterModule.forChild(forgotPasswordPageRoutes), SharedModule, TranslateModule],
  declarations: [
    RemindPasswordComponent,
    RemindPasswordFormComponent,
    UpdatePasswordComponent,
    UpdatePasswordFormComponent,
  ],
})
export class ForgotPasswordPageModule {}
