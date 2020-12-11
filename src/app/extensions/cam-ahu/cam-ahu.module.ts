import { NgModule } from '@angular/core';

import { SharedModule } from 'ish-shared/shared.module';

import { UnitAhuLongDescriptionPipe } from './pipes/unit-ahu-long-description.pipe';

@NgModule({
  imports: [SharedModule],
  declarations: [UnitAhuLongDescriptionPipe],
  exports: [SharedModule, UnitAhuLongDescriptionPipe],
  providers: [UnitAhuLongDescriptionPipe],
})
export class CamAhuModule {}
