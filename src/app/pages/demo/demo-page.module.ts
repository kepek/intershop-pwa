import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { RouterModule, Routes } from '@angular/router';
import { IconModule } from 'camfil-shared/icon/icon.module';
import { MaterialModule } from 'camfil-shared/material/material.module';

import { SharedModule } from 'ish-shared/shared.module';

import { CamfilCamcardsSearchComponent } from './camfil-camcards-search/camfil-camcards-search.component';
import { DemoBottomSheetComponent } from './demo-bottom-sheet/demo-bottom-sheet.component';
import { DemoDialogComponent } from './demo-dialog/demo-dialog.component';
import { DemoPageComponent } from './demo-page.component';

const demoPageRoutes: Routes = [{ path: '', component: DemoPageComponent }];

@NgModule({
  imports: [
    FormsModule,
    IconModule,
    MatDialogModule,
    MaterialModule,
    RouterModule.forChild(demoPageRoutes),
    SharedModule,
  ],
  declarations: [CamfilCamcardsSearchComponent, DemoBottomSheetComponent, DemoDialogComponent, DemoPageComponent],
})
export class DemoPageModule {}
