import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'ish-shared/shared.module';

import { CamfilLoginOnBehalfPageComponent } from './camfil-login-on-behalf-page.component';

const routes: Routes = [{ path: '', pathMatch: 'full', component: CamfilLoginOnBehalfPageComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes), SharedModule],
  declarations: [CamfilLoginOnBehalfPageComponent],
})
export class CamfilLoginOnBehalfPageModule {}
