import { CustomerData } from 'ish-core/models/customer/customer.interface';

export interface CamfilB2bCustomerData extends CustomerData {
  id: string;
  parent: boolean;
}
