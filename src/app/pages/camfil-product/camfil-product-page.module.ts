import { NgModule } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { RouterModule, Routes } from '@angular/router';
import { MaterialModule } from 'camfil-shared/material/material.module';

import { SharedModule } from 'ish-shared/shared.module';

import { ProductBundlePartsComponent } from '../product/product-bundle-parts/product-bundle-parts.component';
import { ProductDetailActionsComponent } from '../product/product-detail-actions/product-detail-actions.component';
import { ProductDetailComponent } from '../product/product-detail/product-detail.component';
import { ProductImagesComponent } from '../product/product-images/product-images.component';
import { ProductLinksCarouselComponent } from '../product/product-links-carousel/product-links-carousel.component';
import { ProductLinksListComponent } from '../product/product-links-list/product-links-list.component';
import { ProductLinksComponent } from '../product/product-links/product-links.component';
import { ProductMasterVariationsComponent } from '../product/product-master-variations/product-master-variations.component';
import { RetailSetPartsComponent } from '../product/retail-set-parts/retail-set-parts.component';

import { CamfilProductAttributesPreviewComponent } from './camfil-product-attributes-preview/camfil-product-attributes-preview.component';
import { CamfilProductDetailComponent } from './camfil-product-detail/camfil-product-detail.component';
import { CamfilProductGuidesComponent } from './camfil-product-guides/camfil-product-guides.component';
import { CamfilProductImagesComponent } from './camfil-product-images/camfil-product-images.component';
import { CamfilProductPageComponent } from './camfil-product-page.component';

const productPageRoutes: Routes = [
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
    MaterialModule,
    RouterModule.forChild(productPageRoutes),
    SharedModule,
  ],
  declarations: [
    CamfilProductAttributesPreviewComponent,
    CamfilProductDetailComponent,
    CamfilProductGuidesComponent,
    CamfilProductImagesComponent,
    CamfilProductPageComponent,
    ProductBundlePartsComponent,
    ProductDetailActionsComponent,
    ProductDetailComponent,
    ProductImagesComponent,
    ProductLinksCarouselComponent,
    ProductLinksComponent,
    ProductLinksListComponent,
    ProductMasterVariationsComponent,
    RetailSetPartsComponent,
  ],
})
export class CamfilProductPageModule {}
