// tslint:disable: ish-ordered-imports ban-specific-imports
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'ish-shared/shared.module';

import { CamOrganizationManagementModule } from '../../cam-organization-management.module';

import { DemoPageComponent } from './demo-page.component';

const demoPageRoutes: Routes = [{ path: '', component: DemoPageComponent }];

@NgModule({
  imports: [CamOrganizationManagementModule, RouterModule.forChild(demoPageRoutes), SharedModule],
  declarations: [DemoPageComponent],
  exports: [],
})
export class DemoPageModule {}
