import { NgModule } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

import { completeIconSet } from '../exports';

@NgModule({})
export class CamfilIconsModule {
  constructor(private domSanitizer: DomSanitizer, public matIconRegistry: MatIconRegistry) {
    completeIconSet.forEach(({ name, data }) => {
      let options = {};
      const start = data.indexOf('viewBox="');

      if (start > -1) {
        const end = data.indexOf('"', start + 9);
        const val = data.slice(start + 9, end);
        options = { viewBox: val };
      }
      this.matIconRegistry.addSvgIconLiteral(name, this.domSanitizer.bypassSecurityTrustHtml(data), options);
    });
  }
}
