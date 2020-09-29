import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { IconModule } from 'camfil-shared/icon/icon.module';
import { MaterialModule } from 'camfil-shared/material/material.module';

import { SharedModule } from 'ish-shared/shared.module';

import { CamfilBannerComponent } from '../../shared/components/camfil-banner/camfil-banner.component';
import { CamfilBulletListComponent } from '../../shared/components/camfil-bullet-list/camfil-bullet-list.component';

import { CamfilInfoSectionComponent } from './camfil-info-section/camfil-info-section.component';
import { CamfilIntroComponent } from './camfil-intro/camfil-intro.component';
import { CamfilRegistrationFormComponent } from './camfil-registration-form/camfil-registration-form.component';
import { CamfilRegistrationPageComponent } from './camfil-registration-page.component';

const registrationPageRoutes: Routes = [{ path: '', component: CamfilRegistrationPageComponent }];

@NgModule({
  imports: [
    FormsModule,
    IconModule,
    MaterialModule,
    ReactiveFormsModule,
    RouterModule.forChild(registrationPageRoutes),
    SharedModule,
  ],
  declarations: [
    CamfilBannerComponent,
    CamfilBulletListComponent,
    CamfilInfoSectionComponent,
    CamfilIntroComponent,
    CamfilRegistrationFormComponent,
    CamfilRegistrationPageComponent,
  ],
})
export class CamfilRegistrationPageModule {}
