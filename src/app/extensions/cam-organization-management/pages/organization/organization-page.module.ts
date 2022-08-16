// tslint:disable: ish-ordered-imports ban-specific-imports
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'ish-shared/shared.module';

import { CamOrganizationManagementModule } from '../../cam-organization-management.module';

import { OrganizationPageComponent } from './organization-page.component';

const organizationPageRoutes: Routes = [{ path: '', component: OrganizationPageComponent }];

@NgModule({
  imports: [CamOrganizationManagementModule, RouterModule.forChild(organizationPageRoutes), SharedModule],
  declarations: [OrganizationPageComponent],
  exports: [],
})
export class OrganizationPageModule {}
