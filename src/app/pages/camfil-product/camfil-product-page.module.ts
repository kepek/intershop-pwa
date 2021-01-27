import { NgModule } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'ish-shared/shared.module';

import { CamfilProductLinksCarouselComponent } from '../product/camfil-product-links-carousel/camfil-product-links-carousel.component';
import { CamfilProductLinksComponent } from '../product/camfil-product-links/camfil-product-links.component';
import { ProductBundlePartsComponent } from '../product/product-bundle-parts/product-bundle-parts.component';
import { ProductDetailActionsComponent } from '../product/product-detail-actions/product-detail-actions.component';
import { ProductDetailComponent } from '../product/product-detail/product-detail.component';
import { ProductImagesComponent } from '../product/product-images/product-images.component';
import { ProductLinksListComponent } from '../product/product-links-list/product-links-list.component';
import { ProductMasterVariationsComponent } from '../product/product-master-variations/product-master-variations.component';
import { RetailSetPartsComponent } from '../product/retail-set-parts/retail-set-parts.component';

import { CamfilProductAttributesPreviewComponent } from './camfil-product-attributes-preview/camfil-product-attributes-preview.component';
import { CamfilProductBadgesComponent } from './camfil-product-badges/camfil-product-badges.component';
import { CamfilProductDetailComponent } from './camfil-product-detail/camfil-product-detail.component';
import { CamfilProductImagesComponent } from './camfil-product-images/camfil-product-images.component';
import { CamfilProductPageComponent } from './camfil-product-page.component';
import { CamfilProductTechnicalDocumentsComponent } from './camfil-product-technical-documents/camfil-product-technical-documents.component';

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
    CamfilProductLinksCarouselComponent,
    CamfilProductLinksComponent,
    CamfilProductPageComponent,
    CamfilProductTechnicalDocumentsComponent,
    ProductBundlePartsComponent,
    ProductDetailActionsComponent,
    ProductDetailComponent,
    ProductImagesComponent,
    ProductLinksListComponent,
    ProductMasterVariationsComponent,
    RetailSetPartsComponent,
  ],
})
export class CamfilProductPageModule {}
