import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'ish-shared/shared.module';

import { CamfilErrorPageComponent } from './camfil-error-page.component';
import { CamfilErrorComponent } from './camfil-error/camfil-error.component';
import { CamfilServerErrorComponent } from './camfil-server-error/camfil-server-error.component';

const camfilErrorPageRoutes: Routes = [
  { path: '', pathMatch: 'full', component: CamfilErrorPageComponent, data: { wrapperClass: 'errorpage' } },
];

@NgModule({
  imports: [RouterModule.forChild(camfilErrorPageRoutes), SharedModule],
  declarations: [CamfilErrorComponent, CamfilErrorPageComponent, CamfilServerErrorComponent],
})
export class CamfilErrorPageModule {}
