import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'ish-shared/shared.module';

import { CategoryCategoriesComponent } from './category-categories/category-categories.component';
import { CategoryImageComponent } from './category-image/category-image.component';
import { CategoryListComponent } from './category-list/category-list.component';
import { CamfilCategoryNavigationComponent } from '../camfil-category/camfil-category-navigation/camfil-category-navigation.component';
import { CategoryPageComponent } from './category-page.component';
import { CamfilCategoryProductsComponent } from '../camfil-category/camfil-category-products/camfil-category-products.component';
import { CamfilCategoryTileComponent } from '../camfil-category/camfil-category-tile/camfil-category-tile.component';
import { CategoryTileComponent } from './category-tile/category-tile.component';
import { CategoryProductsComponent } from './category-products/category-products.component';
import { CategoryNavigationComponent } from './category-navigation/category-navigation.component';

const categoryPageRoutes: Routes = [
  {
    // compatibility to old routes
    path: 'category/:categoryUniqueId',
    component: CategoryPageComponent,
  },
  { path: '**', component: CategoryPageComponent },
];

@NgModule({
  imports: [RouterModule.forChild(categoryPageRoutes), SharedModule],
  declarations: [
    CategoryCategoriesComponent,
    CategoryImageComponent,
    CategoryListComponent,
    CamfilCategoryNavigationComponent,
    CategoryPageComponent,
    CamfilCategoryProductsComponent,
    CamfilCategoryTileComponent,
    CategoryTileComponent,
    CategoryProductsComponent,
    CategoryNavigationComponent,
  ],
})
export class CategoryPageModule {}
