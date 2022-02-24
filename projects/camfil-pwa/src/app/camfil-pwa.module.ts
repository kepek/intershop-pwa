import { NgModule } from '@angular/core';
import { CamfilPwaStoreModule } from 'camfil-pwa/store/camfil-pwa-store.module';

import { CamfilPwaRoutingModule } from './pages/camfil-pwa-routing.module';

@NgModule({
  imports: [CamfilPwaRoutingModule, CamfilPwaStoreModule],
})
export class CamfilPwaModule {}
