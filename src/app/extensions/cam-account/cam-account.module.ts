import { NgModule } from '@angular/core';

import { SharedModule } from 'ish-shared/shared.module';

import { CamfilDeliveryAddressComponent } from './components/camfil-delivery-address/camfil-delivery-address.component';

const exportedComponents = [CamfilDeliveryAddressComponent];

@NgModule({
  imports: [SharedModule],
  declarations: [...exportedComponents],
  exports: [...exportedComponents, SharedModule],
})
export class CamAccountModule {}
