import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { environment } from '../../../../environments/environment';

const routes: Routes = environment.production
  ? []
  : [{ path: 'demo', loadChildren: () => import('./demo/demo-page.module').then(m => m.DemoPageModule) }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CamDemoRoutingModule {}
