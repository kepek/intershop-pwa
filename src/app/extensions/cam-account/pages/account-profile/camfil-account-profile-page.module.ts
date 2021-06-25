import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { SharedModule } from 'ish-shared/shared.module';

import { CamAccountModule } from '../../cam-account.module';

import { CamfilAccountDetailsFormComponent } from './camfil-account-details-form/camfil-account-details-form.component';
import { CamfilAccountLanguageFormComponent } from './camfil-account-language-form/camfil-account-language-form.component';
import { CamfilAccountPasswordFormComponent } from './camfil-account-password-form/camfil-account-password-form.component';
import { CamfilAccountProfilePageComponent } from './camfil-account-profile-page.component';
import { CamfilAccountProfileComponent } from './camfil-account-profile/camfil-account-profile.component';

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
    CamfilAccountDetailsFormComponent,
    CamfilAccountLanguageFormComponent,
    CamfilAccountPasswordFormComponent,
    CamfilAccountProfileComponent,
    CamfilAccountProfilePageComponent,
  ],
})
export class CamfilAccountProfilePageModule {}
