import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CamUserModule } from '../../cam-user.module';

import { LoginPageComponent } from './login-page.component';

const loginPageRoutes: Routes = [{ path: '', component: LoginPageComponent }];

@NgModule({
  imports: [CamUserModule, RouterModule.forChild(loginPageRoutes)],
  declarations: [LoginPageComponent],
})
export class LoginPageModule {}
