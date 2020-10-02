import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export function normalizeLocale(locale: string): string {
  return locale.toLowerCase().replace(/_/g, '-');
}

@Pipe({ name: 'camfilDate', pure: true })
export class CamfilDatePipe implements PipeTransform {
  constructor(private translateService: TranslateService) {}

  transform(value: number | Date): string {
    return new Intl.DateTimeFormat(normalizeLocale(this.translateService.currentLang)).format(value);
  }
}
