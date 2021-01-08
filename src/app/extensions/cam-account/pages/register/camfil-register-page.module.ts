import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'ish-shared/shared.module';

import { CamAccountModule } from '../../cam-account.module';

import { CamfilApplyFormComponent } from './camfil-apply-form/camfil-apply-form.component';
import { CamfilInfoSectionComponent } from './camfil-info-section/camfil-info-section.component';
import { CamfilRegisterPageComponent } from './camfil-register-page.component';

const registerPageRoutes: Routes = [{ path: '', component: CamfilRegisterPageComponent }];

@NgModule({
  imports: [CamAccountModule, RouterModule.forChild(registerPageRoutes), SharedModule],
  declarations: [CamfilApplyFormComponent, CamfilInfoSectionComponent, CamfilRegisterPageComponent],
})
export class CamfilRegisterPageModule {}
