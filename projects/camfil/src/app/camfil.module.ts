import { NgModule } from '@angular/core';

import { SharedModule } from 'ish-shared/shared.module';

import { AccountOrderTemplateDetailPageComponent } from './pages/account-order-template-detail/account-order-template-detail-page.component';
import { AccountOrderTemplatePageComponent } from './pages/account-order-template/account-order-template-page.component';
import { CamfilRoutingModule } from './pages/camfil-routing.module';
import { HomePageComponent } from './pages/home/home-page.component';

@NgModule({
  declarations: [AccountOrderTemplateDetailPageComponent, AccountOrderTemplatePageComponent, HomePageComponent],
  imports: [CamfilRoutingModule, SharedModule],
})
export class CamfilModule {}
