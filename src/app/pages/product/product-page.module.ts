import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'ish-shared/shared.module';

import { ProductPageComponent } from './product-page.component';

const productPageRoutes: Routes = [
  {
    // compatibility to old routes
    path: 'product/:sku',
    children: [
      {
        path: '**',
        component: ProductPageComponent,
      },
    ],
  },
  {
    // compatibility to old routes
    path: 'category/:categoryUniqueId/product/:sku',
    children: [
      {
        path: '**',
        component: ProductPageComponent,
      },
    ],
  },
  { path: '**', component: ProductPageComponent },
];

@NgModule({
  imports: [RouterModule.forChild(productPageRoutes), SharedModule],
})
export class ProductPageModule {}
