import { NgModule } from '@angular/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule, Routes } from '@angular/router';
import { MaterialModule } from 'camfil-shared/material/material.module';

import { SharedModule } from 'ish-shared/shared.module';

import { CategoryImageComponent } from '../category/category-image/category-image.component';
import { CategoryListComponent } from '../category/category-list/category-list.component';

import { CamfilCategoryBoxComponent } from './camfil-category-box/camfil-category-box.component';
import { CamfilCategoryBoxesComponent } from './camfil-category-boxes/camfil-category-boxes.component';
import { CamfilCategoryCategoriesComponent } from './camfil-category-categories/camfil-category-categories.component';
import { CamfilCategoryNavigationComponent } from './camfil-category-navigation/camfil-category-navigation.component';
import { CamfilCategoryPageComponent } from './camfil-category-page.component';
import { CamfilCategoryProductsComponent } from './camfil-category-products/camfil-category-products.component';
import { CamfilCategoryTileComponent } from './camfil-category-tile/camfil-category-tile.component';

const categoryPageRoutes: Routes = [
  {
    // compatibility to old routes
    path: 'category/:categoryUniqueId',
    component: CamfilCategoryPageComponent,
  },
  { path: '**', component: CamfilCategoryPageComponent },
];

@NgModule({
  imports: [
    MatExpansionModule,
    MatIconModule,
    MatToolbarModule,
    MaterialModule,
    RouterModule.forChild(categoryPageRoutes),
    SharedModule,
  ],
  declarations: [
    CamfilCategoryBoxComponent,
    CamfilCategoryBoxesComponent,
    CamfilCategoryCategoriesComponent,
    CamfilCategoryNavigationComponent,
    CamfilCategoryPageComponent,
    CamfilCategoryProductsComponent,
    CamfilCategoryTileComponent,
    CategoryImageComponent,
    CategoryListComponent,
  ],
})
export class CamfilCategoryPageModule {}
