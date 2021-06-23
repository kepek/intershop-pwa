import { Pipe, PipeTransform } from '@angular/core';
import slugify from 'slugify';

export function normalizeLocale(locale: string): string {
  return locale.toLowerCase().replace(/_/g, '-');
}

@Pipe({ name: 'slugify', pure: true })
export class CamfilSlugifyPipe implements PipeTransform {
  constructor() {}

  transform(value: string, prefix: string): string {
    return `${prefix}.${slugify(value, '.')?.toLowerCase()}`;
  }
}
