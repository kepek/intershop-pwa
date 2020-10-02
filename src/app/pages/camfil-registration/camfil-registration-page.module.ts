import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { IconModule } from 'camfil-shared/icon/icon.module';
import { MaterialModule } from 'camfil-shared/material/material.module';

import { CamfilBannerComponent } from 'ish-shared/components/camfil-banner/camfil-banner.component';
import { CamfilBulletListComponent } from 'ish-shared/components/camfil-bullet-list/camfil-bullet-list.component';
import { CamfilHeaderBoxComponent } from 'ish-shared/components/common/camfil-header-box/camfil-header-box.component';
import { SharedModule } from 'ish-shared/shared.module';

import { CamfilInfoSectionComponent } from './camfil-info-section/camfil-info-section.component';
import { CamfilRegistrationFormComponent } from './camfil-registration-form/camfil-registration-form.component';
import { CamfilRegistrationPageComponent } from './camfil-registration-page.component';

const camfilRegistrationPageRoutes: Routes = [{ path: '', component: CamfilRegistrationPageComponent }];

@NgModule({
  imports: [
    FormsModule,
    IconModule,
    MaterialModule,
    ReactiveFormsModule,
    RouterModule.forChild(camfilRegistrationPageRoutes),
    SharedModule,
  ],
  declarations: [
    CamfilBannerComponent,
    CamfilBulletListComponent,
    CamfilHeaderBoxComponent,
    CamfilInfoSectionComponent,
    CamfilRegistrationFormComponent,
    CamfilRegistrationPageComponent,
  ],
  exports: [CamfilBulletListComponent],
})
export class CamfilRegistrationPageModule {}
