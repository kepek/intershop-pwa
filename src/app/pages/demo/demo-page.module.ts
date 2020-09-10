import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterModule, Routes } from '@angular/router';
import { MaterialModule } from 'camfil-shared/material/material.module';

import { SharedModule } from 'ish-shared/shared.module';

import { DemoBottomSheetComponent } from './demo-bottom-sheet/demo-bottom-sheet.component';
import { DemoDialogComponent } from './demo-dialog/demo-dialog.component';
import { DemoPageComponent } from './demo-page.component';

const demoPageRoutes: Routes = [{ path: '', component: DemoPageComponent }];

@NgModule({
  imports: [FormsModule, MatDialogModule, MaterialModule, RouterModule.forChild(demoPageRoutes), SharedModule],
  declarations: [DemoBottomSheetComponent, DemoDialogComponent, DemoPageComponent],
})
export class DemoPageModule {}
