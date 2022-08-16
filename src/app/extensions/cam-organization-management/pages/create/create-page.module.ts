// tslint:disable: ish-ordered-imports ban-specific-imports
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'ish-shared/shared.module';

import { CamOrganizationManagementModule } from '../../cam-organization-management.module';

import { CreatePageComponent } from './create-page.component';

const camUserDetailPageRoutes: Routes = [{ path: '', component: CreatePageComponent }];

@NgModule({
  imports: [CamOrganizationManagementModule, RouterModule.forChild(camUserDetailPageRoutes), SharedModule],
  declarations: [CreatePageComponent],
})
export class CreatePageModule {}
