import { CamfilB2bCustomer } from '../camfil-b2b-customer/camfil-b2b-customer.model';
import { CamfilB2bUser } from '../camfil-b2b-user/camfil-b2b-user.model';

export type CamfilB2bOrganizationUser = CamfilB2bUser & { customer: CamfilB2bCustomer };
