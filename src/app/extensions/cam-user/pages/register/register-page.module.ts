import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MaterialModule } from 'camfil-shared/material/material.module';

import { CamUserModule } from '../../cam-user.module';

import { ApplyFormComponent } from './apply-form/apply-form.component';
import { InfoSectionComponent } from './info-section/info-section.component';
import { RegisterPageComponent } from './register-page.component';

const registerPageRoutes: Routes = [{ path: '', component: RegisterPageComponent }];

@NgModule({
  imports: [CamUserModule, MaterialModule, RouterModule.forChild(registerPageRoutes)],
  declarations: [ApplyFormComponent, InfoSectionComponent, RegisterPageComponent],
})
export class RegisterPageModule {}
