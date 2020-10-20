import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { SharedModule } from 'ish-shared/shared.module';

import { CamAccountModule } from '../../cam-account.module';

import { RequestUserAccountsFormComponent } from './request-user-accounts-form/request-user-accounts-form.component';
import { RequestUserAccountsComponent } from './request-user-accounts/request-user-accounts.component';

const forgotUsernamePageRoutes: Routes = [{ path: '', component: RequestUserAccountsComponent }];

@NgModule({
  imports: [CamAccountModule, RouterModule.forChild(forgotUsernamePageRoutes), SharedModule, TranslateModule],
  declarations: [RequestUserAccountsComponent, RequestUserAccountsFormComponent],
})
export class ForgotUsernamePageModule {}
