import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'ish-shared/shared.module';

import { CamfilAHUPageDetailComponent } from './camfil-ahu-page-detail.component';

const camfilAHUPageRoutes: Routes = [{ path: '', component: CamfilAHUPageDetailComponent }];

@NgModule({
  imports: [RouterModule.forChild(camfilAHUPageRoutes), SharedModule],
  declarations: [CamfilAHUPageDetailComponent],
})
export class CamfilAHUPageDetailModule {}
