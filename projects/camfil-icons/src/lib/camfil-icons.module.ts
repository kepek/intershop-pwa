import { NgModule } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

import { completeIconSet } from '../exports';

@NgModule({})
export class CamfilIconsModule {
  constructor(private domSanitizer: DomSanitizer, public matIconRegistry: MatIconRegistry) {
    completeIconSet.forEach(icon => {
      this.matIconRegistry.addSvgIconLiteral(icon.name, this.domSanitizer.bypassSecurityTrustHtml(icon.data));
    });
  }
}
