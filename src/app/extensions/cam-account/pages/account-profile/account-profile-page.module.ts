import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CamAccountModule } from '../../cam-account.module';

import { AccountProfilePageComponent } from './account-profile-page.component';
import { AccountProfileComponent } from './account-profile/account-profile.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { PersonalInfoComponent } from './personal-info-form/personal-info.component';

const accountProfilePageRoutes: Routes = [{ path: '', component: AccountProfilePageComponent }];

@NgModule({
  imports: [CamAccountModule, RouterModule.forChild(accountProfilePageRoutes)],
  declarations: [AccountProfileComponent, AccountProfilePageComponent, ChangePasswordComponent, PersonalInfoComponent],
})
export class AccountProfilePageModule {}
