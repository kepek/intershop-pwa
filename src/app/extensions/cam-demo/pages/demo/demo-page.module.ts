import { NgModule } from '@angular/core';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'ish-shared/shared.module';

import { CamAhuModule } from '../../../cam-ahu/cam-ahu.module';

import { DemoBottomSheetComponent } from './demo-bottom-sheet/demo-bottom-sheet.component';
import { DemoDialogComponent } from './demo-dialog/demo-dialog.component';
import { DemoPageComponent } from './demo-page.component';

const demoPageRoutes: Routes = [{ path: '', pathMatch: 'full', component: DemoPageComponent }];

@NgModule({
  imports: [CamAhuModule, MatDialogModule, RouterModule.forChild(demoPageRoutes), SharedModule],
  declarations: [DemoBottomSheetComponent, DemoDialogComponent, DemoPageComponent],
})
export class DemoPageModule {}
