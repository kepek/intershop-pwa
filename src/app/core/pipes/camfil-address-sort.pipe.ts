import { Pipe, PipeTransform } from '@angular/core';
import { CamCardAddress } from 'src/app/extensions/cam-cards/models/cam-card/cam-card.model';

@Pipe({
  name: 'addressSort',
})
export class AddressSortPipe implements PipeTransform {
  sortedArray: Array<CamCardAddress>;
  transform(array: Array<CamCardAddress>, fieldName: string): Array<CamCardAddress> {
    if (!Array.isArray(array)) {
      return;
    }
    this.sortedArray = array.slice().sort((a: any, b: any) => {
      if (a[fieldName] < b[fieldName]) {
        return -1;
      } else if (a[fieldName] > b[fieldName]) {
        return 1;
      } else {
        return 0;
      }
    });
    return this.sortedArray;
  }
}
