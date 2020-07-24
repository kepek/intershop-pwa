import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AccountOrderTemplateDetailPageComponent } from './account-order-template-detail/account-order-template-detail-page.component';
import { AccountOrderTemplatePageComponent } from './account-order-template/account-order-template-page.component';
import { HomePageComponent } from './home/home-page.component';

/**
 * routes for the organization management
 *f
 * visible for testing
 */
export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomePageComponent },
  { path: 'account/order-templates', component: AccountOrderTemplatePageComponent },
  { path: 'account/order-templates/:orderTemplateName', component: AccountOrderTemplateDetailPageComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CamfilRoutingModule {}
