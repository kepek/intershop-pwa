import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from 'ish-shared/shared.module';

import { HomePageComponent } from './home-page.component';

const homePageRoutes: Routes = [{ path: '', component: HomePageComponent, data: { wrapperClass: 'homepage' } }];

@NgModule({
  imports: [FormsModule, RouterModule.forChild(homePageRoutes), SharedModule],
  exports: [FormsModule],
  declarations: [HomePageComponent],
})
export class HomePageModule {}
