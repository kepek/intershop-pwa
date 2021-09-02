import { Pipe, PipeTransform } from '@angular/core';
import { CamCardContact } from 'src/app/extensions/cam-cards/models/cam-card/cam-card.model';

@Pipe({ name: 'camfilContactSort' })
export class CamfilContactSortPipe implements PipeTransform {
  transform(contacts: CamCardContact[]): CamCardContact[] {
    if (!Array.isArray(contacts)) {
      return;
    }
    return contacts.slice().sort((a: any, b: any) => {
      if (a.fullName?.toLowerCase() < b.fullName.toLowerCase()) {
        return -1;
      } else if (a.fullName.toLowerCase() > b.fullName.toLowerCase()) {
        return 1;
      } else {
        return 0;
      }
    });
  }
}
