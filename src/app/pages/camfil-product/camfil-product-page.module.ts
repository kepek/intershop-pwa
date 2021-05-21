import { NgModule } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'ish-shared/shared.module';

import { CamfilProductAttributesPreviewComponent } from './camfil-product-attributes-preview/camfil-product-attributes-preview.component';
import { CamfilProductBadgesComponent } from './camfil-product-badges/camfil-product-badges.component';
import { CamfilProductDetailComponent } from './camfil-product-detail/camfil-product-detail.component';
import { CamfilProductImagesComponent } from './camfil-product-images/camfil-product-images.component';
import { CamfilProductPageComponent } from './camfil-product-page.component';

const camfilProductPageRoutes: Routes = [
  {
    // compatibility to old routes
    path: 'product/:sku',
    children: [
      {
        path: '**',
        component: CamfilProductPageComponent,
      },
    ],
  },
  {
    // compatibility to old routes
    path: 'category/:categoryUniqueId/product/:sku',
    children: [
      {
        path: '**',
        component: CamfilProductPageComponent,
      },
    ],
  },
  { path: '**', component: CamfilProductPageComponent },
];

@NgModule({
  imports: [
    MatExpansionModule,
    MatIconModule,
    MatListModule,
    RouterModule.forChild(camfilProductPageRoutes),
    SharedModule,
  ],
  declarations: [
    CamfilProductAttributesPreviewComponent,
    CamfilProductBadgesComponent,
    CamfilProductDetailComponent,
    CamfilProductImagesComponent,
    CamfilProductPageComponent,
  ],
  exports: [CamfilProductDetailComponent],
})
export class CamfilProductPageModule {}
