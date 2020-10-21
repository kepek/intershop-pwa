import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'ish-shared/shared.module';

import { CamfilAHUPageComponent } from './camfil-ahu-page.component';


const camfilAHUPageRoutes: Routes = [{ path: '', component: CamfilAHUPageComponent }];

@NgModule({
  imports: [RouterModule.forChild(camfilAHUPageRoutes), SharedModule, SharedModule],
  declarations: [CamfilAHUPageComponent],
})
export class CamfilAHUPageModule {}
