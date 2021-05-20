import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { UnitAhuLongDescription } from '../models/unit/unit.model';

@Pipe({ name: 'ahuTranslate', pure: true })
export class AhuTranslatePipe implements PipeTransform {
  constructor(private translateService: TranslateService) {}

  transform(value: UnitAhuLongDescription[]): string {
    const currentLang = this.translateService.currentLang.replace(/_/, '-').toUpperCase();

    return value?.find(v => v.lang === currentLang || v.lang.startsWith(currentLang))?.text || value[0]?.text;
  }
}
