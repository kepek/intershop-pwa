import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'ish-shared/shared.module';

import { CamUserModule } from '../../cam-user.module';

import { ApplyFormComponent } from './apply-form/apply-form.component';
import { InfoSectionComponent } from './info-section/info-section.component';
import { RegisterPageComponent } from './register-page.component';

const registerPageRoutes: Routes = [{ path: '', component: RegisterPageComponent }];

@NgModule({
  imports: [CamUserModule, RouterModule.forChild(registerPageRoutes), SharedModule],
  declarations: [ApplyFormComponent, InfoSectionComponent, RegisterPageComponent],
})
export class RegisterPageModule {}
