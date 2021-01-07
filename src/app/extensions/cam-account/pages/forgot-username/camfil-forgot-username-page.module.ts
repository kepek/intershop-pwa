import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { SharedModule } from 'ish-shared/shared.module';

import { CamAccountModule } from '../../cam-account.module';

import { CamfilRequestUserAccountsFormComponent } from './camfil-request-user-accounts-form/camfil-request-user-accounts-form.component';
import { CamfilRequestUserAccountsComponent } from './camfil-request-user-accounts/camfil-request-user-accounts.component';

const forgotUsernamePageRoutes: Routes = [{ path: '', component: CamfilRequestUserAccountsComponent }];

@NgModule({
  imports: [CamAccountModule, RouterModule.forChild(forgotUsernamePageRoutes), SharedModule, TranslateModule],
  declarations: [CamfilRequestUserAccountsComponent, CamfilRequestUserAccountsFormComponent],
})
export class CamfilForgotUsernamePageModule {}
