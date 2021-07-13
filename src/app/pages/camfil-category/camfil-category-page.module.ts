import { NgModule } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'ish-shared/shared.module';

import { CategoryImageComponent } from '../category/category-image/category-image.component';
import { CategoryListComponent } from '../category/category-list/category-list.component';

import { CamfilCategoryBoxesComponent } from './camfil-category-boxes/camfil-category-boxes.component';
import { CamfilCategoryCategoriesComponent } from './camfil-category-categories/camfil-category-categories.component';
import { CamfilCategoryFaqComponent } from './camfil-category-faq/camfil-category-faq.component';
import { CamfilCategoryNavigationComponent } from './camfil-category-navigation/camfil-category-navigation.component';
import { CamfilCategoryPageComponent } from './camfil-category-page.component';
import { CamfilCategoryProductsComponent } from './camfil-category-products/camfil-category-products.component';
import { CamfilCategoryTileComponent } from './camfil-category-tile/camfil-category-tile.component';

const camfilCategoryPageRoutes: Routes = [
  {
    // compatibility to old routes
    path: 'category/:categoryUniqueId',
    component: CamfilCategoryPageComponent,
  },
  {
    // route to handle category links managed by CMS
    path: 'categoryref/:categoryRefId',
    component: CamfilCategoryPageComponent,
  },
  { path: '**', component: CamfilCategoryPageComponent },
];

@NgModule({
  imports: [
    MatExpansionModule,
    MatIconModule,
    MatToolbarModule,
    RouterModule.forChild(camfilCategoryPageRoutes),
    SharedModule,
  ],
  declarations: [
    CamfilCategoryBoxesComponent,
    CamfilCategoryCategoriesComponent,
    CamfilCategoryFaqComponent,
    CamfilCategoryNavigationComponent,
    CamfilCategoryPageComponent,
    CamfilCategoryProductsComponent,
    CamfilCategoryTileComponent,
    CategoryImageComponent,
    CategoryListComponent,
  ],
})
export class CamfilCategoryPageModule {}
