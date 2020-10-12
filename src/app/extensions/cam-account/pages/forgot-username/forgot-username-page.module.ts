import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CamAccountModule } from '../../cam-account.module';
import { RequestUserAccountsComponent } from './request-user-accounts/request-user-accounts.component';
import { RequestUserAccountsFormComponent } from './request-user-accounts-form/request-user-accounts-form.component';

const forgotUsernamePageRoutes: Routes = [{ path: '', component: RequestUserAccountsComponent }];

@NgModule({
  imports: [RouterModule.forChild(forgotUsernamePageRoutes), CamAccountModule],
  declarations: [RequestUserAccountsComponent, RequestUserAccountsFormComponent],
})
export class ForgotUsernamePageModule { }
