import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'air-handling-unit-guide',
    loadChildren: () => import('./camfil-ahu/camfil-ahu-page.module').then(m => m.CamfilAHUPageModule),
    data: { feature: 'camAhu', breadcrumbData: [{ key: 'camfil.ahu.link' }] },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CamAhuRoutingModule {}
