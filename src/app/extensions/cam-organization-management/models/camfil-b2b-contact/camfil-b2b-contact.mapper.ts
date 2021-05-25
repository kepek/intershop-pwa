import { Injectable } from '@angular/core';

import { CamfilB2bContactData } from './camfil-b2b-contact.interface';
import { CamfilB2bContact } from './camfil-b2b-contact.model';

@Injectable({ providedIn: 'root' })
export class CamfilB2bContactMapper {
  static fromData(data: CamfilB2bContactData): CamfilB2bContact {
    if (data?.erpId) {
      const camfilB2bContact: CamfilB2bContact = { ...data };

      if (data?.firstName && data?.lastName) {
        camfilB2bContact.fullName = `${data.firstName} ${data.lastName}`;
      }

      return camfilB2bContact;
    } else {
      throw new Error(`'CamfilB2bContactData' is required for the mapping`);
    }
  }

  static fromListData(data: CamfilB2bContactData[]): CamfilB2bContact[] {
    if (data) {
      return data.map(CamfilB2bContactMapper.fromData);
    } else {
      throw new Error('CamfilB2bContactData[] is required');
    }
  }
}
