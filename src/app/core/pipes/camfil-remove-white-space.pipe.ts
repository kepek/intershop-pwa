import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'camfilRemoveWhiteSpacesPipe', pure: true })
export class CamfilRemoveWhiteSpacesPipe implements PipeTransform {
  constructor() {}

  transform(value: string): string {
    return value?.replace(/\s/g, '');
  }
}
