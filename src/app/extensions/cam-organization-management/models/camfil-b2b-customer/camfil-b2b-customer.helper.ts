import { CamfilB2bCustomer } from './camfil-b2b-customer.model';

export class CamfilB2bCustomerHelper {
  static equal(camfilB2bCustomer1: CamfilB2bCustomer, camfilB2bCustomer2: CamfilB2bCustomer): boolean {
    return !!camfilB2bCustomer1 && !!camfilB2bCustomer2 && camfilB2bCustomer1.id === camfilB2bCustomer2.id;
  }
}
