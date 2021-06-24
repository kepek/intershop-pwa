import { Pipe, PipeTransform } from '@angular/core';
import slugify from 'slugify';

@Pipe({ name: 'slugify', pure: true })
export class CamfilSlugifyPipe implements PipeTransform {
  transform(value: string, prefix: string): string {
    return `${slugify(prefix, '.')}.${slugify(value, '.')?.toLowerCase()}`;
  }
}
