import { NgModule } from '@angular/core';

import { SharedModule } from 'ish-shared/shared.module';

import { CamfilAhuSlotTypeComponent } from './pages/camfil-ahu-detail/camfil-ahu-slot-type/camfil-ahu-slot-type.component';
import { AhuTranslatePipe } from './pipes/ahu-translate.pipe';

@NgModule({
  imports: [SharedModule],
  declarations: [AhuTranslatePipe, CamfilAhuSlotTypeComponent],
  exports: [AhuTranslatePipe, CamfilAhuSlotTypeComponent, SharedModule],
  providers: [AhuTranslatePipe],
})
export class CamAhuModule {}
