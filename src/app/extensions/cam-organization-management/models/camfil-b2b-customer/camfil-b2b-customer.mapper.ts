import { Injectable } from '@angular/core';

import { CustomerMapper } from 'ish-core/models/customer/customer.mapper';

import { CamfilB2bCustomerData } from './camfil-b2b-customer.interface';
import { CamfilB2bCustomer } from './camfil-b2b-customer.model';

@Injectable({ providedIn: 'root' })
export class CamfilB2bCustomerMapper extends CustomerMapper {
  static fromData(data: CamfilB2bCustomerData): CamfilB2bCustomer {
    const { id, parent, preferredInvoiceToAddress } = data;

    return {
      ...CustomerMapper.fromData(data),
      id,
      parent,
      preferredInvoiceToAddress,
    };
  }

  static fromListData(data: CamfilB2bCustomerData[]): CamfilB2bCustomer[] {
    return data.map(customer => CamfilB2bCustomerMapper.fromData(customer));
  }
}
