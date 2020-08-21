import { NgModule } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'ish-shared/shared.module';

import { CategoryCategoriesComponent } from '../category/category-categories/category-categories.component';
import { CategoryImageComponent } from '../category/category-image/category-image.component';
import { CategoryListComponent } from '../category/category-list/category-list.component';
import { CategoryNavigationComponent } from '../category/category-navigation/category-navigation.component';
import { CategoryPageComponent } from '../category/category-page.component';
import { CategoryProductsComponent } from '../category/category-products/category-products.component';
import { CategoryTileComponent } from '../category/category-tile/category-tile.component';

import { CamfilCategoryCategoriesComponent } from './camfil-category-categories/camfil-category-categories.component';
import { CamfilCategoryNavigationComponent } from './camfil-category-navigation/camfil-category-navigation.component';
import { CamfilCategoryProductsComponent } from './camfil-category-products/camfil-category-products.component';
import { CamfilCategoryTileComponent } from './camfil-category-tile/camfil-category-tile.component';

const categoryPageRoutes: Routes = [
  {
    // compatibility to old routes
    path: 'category/:categoryUniqueId',
    component: CategoryPageComponent,
  },
  { path: '**', component: CategoryPageComponent },
];

@NgModule({
  imports: [
    MatExpansionModule,
    MatIconModule,
    MatToolbarModule,
    RouterModule.forChild(categoryPageRoutes),
    SharedModule,
  ],
  declarations: [
    CamfilCategoryCategoriesComponent,
    CamfilCategoryNavigationComponent,
    CamfilCategoryProductsComponent,
    CamfilCategoryTileComponent,
    CategoryCategoriesComponent,
    CategoryImageComponent,
    CategoryListComponent,
    CategoryNavigationComponent,
    CategoryPageComponent,
    CategoryProductsComponent,
    CategoryTileComponent,
  ],
})
export class CamfilCategoryPageModule {}
