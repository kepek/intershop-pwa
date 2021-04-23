import { Injectable } from '@angular/core';

import { CustomerMapper } from 'ish-core/models/customer/customer.mapper';

import { CamfilB2bContactMapper } from '../camfil-b2b-contact/camfil-b2b-contact.mapper';

import { CamfilB2bCustomerData } from './camfil-b2b-customer.interface';
import { CamfilB2bCustomer } from './camfil-b2b-customer.model';

@Injectable({ providedIn: 'root' })
export class CamfilB2bCustomerMapper extends CustomerMapper {
  static fromData(data: CamfilB2bCustomerData): CamfilB2bCustomer {
    if (data?.id) {
      const { id, parent, preferredInvoiceToAddress, contacts, userContact } = data;
      const customer = CustomerMapper.fromData(data);
      const camfilB2bCustomer: CamfilB2bCustomer = { ...customer, id, parent, preferredInvoiceToAddress };

      if (contacts?.length) {
        camfilB2bCustomer.contacts = CamfilB2bContactMapper.fromListData(contacts);
      }

      if (userContact?.erpId) {
        camfilB2bCustomer.userContact = CamfilB2bContactMapper.fromData(userContact);
      }

      return camfilB2bCustomer;
    } else {
      throw new Error('CamfilB2bCustomerData is required');
    }
  }

  static fromListData(data: CamfilB2bCustomerData[]): CamfilB2bCustomer[] {
    if (data?.length) {
      return data.map(customer => CamfilB2bCustomerMapper.fromData(customer));
    } else {
      throw new Error('CamfilB2bCustomerData[] is required');
    }
  }
}
