import { DOCUMENT } from '@angular/common';
import { Inject, NgModule } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

import { completeIconSet } from '../exports';

@NgModule({})
export class CamfilIconsModule {
  constructor(
    private domSanitizer: DomSanitizer,
    public matIconRegistry: MatIconRegistry,
    @Inject(DOCUMENT) private document: Document
  ) {
    completeIconSet.forEach(({ name, data }) => {
      const svgElement = this.svgElementFromString(data);
      const options = {
        viewBox: svgElement.getAttribute('viewBox'),
      };
      this.matIconRegistry.addSvgIconLiteral(name, this.domSanitizer.bypassSecurityTrustHtml(data), options);
    });
  }

  private svgElementFromString(svgContent: string): SVGElement {
    const div = this.document.createElement('DIV');
    div.innerHTML = svgContent;
    return div.querySelector('svg') || this.document.createElementNS('http://www.w3.org/2000/svg', 'path');
  }
}
