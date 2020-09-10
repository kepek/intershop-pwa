import { NgModule } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { MaterialModule } from 'camfil-shared/material/material.module';

export interface CamfilIcon {
  name: string;
  path: string;
}

export const getCamfilIcons = (): CamfilIcon[] => {
  // @ts-ignore
  const context = require.context('../../../assets/icons/', true, /\.svg$/);

  return context.keys().map(key => {
    const name = key.split('/').pop().split('.').slice(0, -1).join('.').replace(/\W+/g, '-').toLowerCase();
    const path = '/camfil/assets/icons/' + key.split('/').pop();

    return { name, path };
  });
};

@NgModule({
  imports: [MaterialModule],
  declarations: [],
  exports: [],
})
export class IconModule {
  constructor(private domSanitizer: DomSanitizer, public matIconRegistry: MatIconRegistry) {
    const icons = getCamfilIcons();

    icons.forEach(icon => {
      this.matIconRegistry.addSvgIcon(icon.name, this.domSanitizer.bypassSecurityTrustResourceUrl(icon.path));
    });
  }
}
