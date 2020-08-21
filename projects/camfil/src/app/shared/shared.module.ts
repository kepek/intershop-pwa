import { NgModule } from '@angular/core';

import { MaterialModule } from './material/material.module';

@NgModule({})
export class SharedModule {
  imports: [MaterialModule];
  exports: [MaterialModule];
}
