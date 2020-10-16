import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { SharedModule } from 'ish-shared/shared.module';

import { CamAccountModule } from '../../cam-account.module';

import { AccountProfilePageComponent } from './account-profile-page.component';
import { AccountProfileComponent } from './account-profile/account-profile.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { PersonalInfoComponent } from './personal-info-form/personal-info.component';

const accountProfilePageRoutes: Routes = [{ path: '', component: AccountProfilePageComponent }];

@NgModule({
  imports: [
    CamAccountModule,
    ReactiveFormsModule,
    RouterModule.forChild(accountProfilePageRoutes),
    SharedModule,
    TranslateModule,
  ],
  declarations: [AccountProfileComponent, AccountProfilePageComponent, ChangePasswordComponent, PersonalInfoComponent],
})
export class AccountProfilePageModule {}
