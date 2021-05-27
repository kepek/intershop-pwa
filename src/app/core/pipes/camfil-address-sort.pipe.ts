import { Pipe, PipeTransform } from '@angular/core';
import { CamCardAddress } from 'src/app/extensions/cam-cards/models/cam-card/cam-card.model';

@Pipe({
  name: 'addressSort',
})
export class AddressSortPipe implements PipeTransform {
  sortedArray: CamCardAddress[];
  transform(array: CamCardAddress[], fieldName: string): CamCardAddress[] {
    if (!Array.isArray(array)) {
      return;
    }
    return array.slice().sort((a: any, b: any) => {
      if (a[fieldName]?.toLowerCase() < b[fieldName].toLowerCase()) {
        return -1;
      } else if (a[fieldName].toLowerCase() > b[fieldName].toLowerCase()) {
        return 1;
      } else {
        return 0;
      }
    });
  }
}
