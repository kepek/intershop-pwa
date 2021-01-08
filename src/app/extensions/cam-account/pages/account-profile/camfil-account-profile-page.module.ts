import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { SharedModule } from 'ish-shared/shared.module';

import { CamAccountModule } from '../../cam-account.module';

import { CamfilAccountProfilePageComponent } from './camfil-account-profile-page.component';
import { CamfilChangePasswordComponent } from './camfil-change-password/camfil-change-password.component';
import { CamfilPersonalInfoComponent } from './camfil-personal-info-form/camfil-personal-info.component';
import { CamfilAccountProfileComponent } from './camil-account-profile/camfil-account-profile.component';

const accountProfilePageRoutes: Routes = [{ path: '', component: CamfilAccountProfilePageComponent }];

@NgModule({
  imports: [
    CamAccountModule,
    ReactiveFormsModule,
    RouterModule.forChild(accountProfilePageRoutes),
    SharedModule,
    TranslateModule,
  ],
  declarations: [
    CamfilAccountProfileComponent,
    CamfilAccountProfilePageComponent,
    CamfilChangePasswordComponent,
    CamfilPersonalInfoComponent,
  ],
})
export class CamfilAccountProfilePageModule {}
