import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'ish-shared/shared.module';

import { HomePageComponent } from './home-page.component';

const homePageRoutes: Routes = [{ path: '', component: HomePageComponent, data: { wrapperClass: 'homepage' } }];

@NgModule({
  imports: [
    FormsModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDividerModule,
    MatIconModule,
    MatSliderModule,
    MatSortModule,
    MatTableModule,
    RouterModule.forChild(homePageRoutes),
    SharedModule,
  ],
  exports: [FormsModule],
  declarations: [HomePageComponent],
})
export class HomePageModule {}
