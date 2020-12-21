import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'ish-shared/shared.module';

import { CamfilErrorComponent } from './camfil-error/camfil-error.component';
import { ErrorPageComponent } from './error-page.component';
import { ServerErrorComponent } from './server-error/server-error.component';

const errorPageRoutes: Routes = [
  { path: '', component: ErrorPageComponent, data: { wrapperClass: 'errorpage', headerType: 'simple' } },
];

@NgModule({
  imports: [RouterModule.forChild(errorPageRoutes), SharedModule],
  declarations: [CamfilErrorComponent, ErrorPageComponent, ServerErrorComponent],
})
export class ErrorPageModule {}
