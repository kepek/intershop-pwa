import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'air-handling-unit-guide',
    loadChildren: () => import('./camfil-ahu/camfil-ahu-page.module').then(m => m.CamfilAHUPageModule),
    data: { feature: 'camAhu', breadcrumbData: [{ key: 'camfil.ahu.link' }] },
  },
  {
    path: 'air-handling-unit-guide/detail',
    loadChildren: () =>
      import('./camfil-ahu-detail/camfil-ahu-page-detail.module').then(m => m.CamfilAHUPageDetailModule),
    data: {
      feature: 'camAhu',
      breadcrumbData: [{ key: 'camfil.ahu.link', link: '/air-handling-unit-guide' }, { key: 'Air Handling Unit Name' }],
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CamAhuRoutingModule {}
