import { NgModule } from '@angular/core';
import { RouterModule, Routes, UrlSerializer } from '@angular/router';
import { CamUrlSerializer } from '../serializers/cam-url-serializer';

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
  providers: [{ provide: UrlSerializer, useClass: CamUrlSerializer }],
})
export class CamAhuRoutingModule {}
