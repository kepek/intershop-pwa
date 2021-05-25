import { CamfilB2bCustomerMapper } from '../camfil-b2b-customer/camfil-b2b-customer.mapper';

import { CamfilB2bUserData } from './camfil-b2b-user.interface';
import { CamfilB2bUser } from './camfil-b2b-user.model';

export class CamfilB2bUserMapper {
  static fromData(data: CamfilB2bUserData): CamfilB2bUser {
    if (data) {
      const { active, userRoles, customers, ...rest } = data;
      const currentLogin = data?.login;
      const roleIDs = userRoles?.userRoles?.map(role => role.roleID);

      const camfilB2bUser: CamfilB2bUser = { ...rest, currentLogin, roleIDs };

      if (active) {
        camfilB2bUser.active = JSON.parse(String(active));
      }

      if (customers?.length) {
        camfilB2bUser.customers = CamfilB2bCustomerMapper.fromListData(customers);
      }

      return camfilB2bUser;
    } else {
      throw new Error('CamfilB2bUserData is required');
    }
  }

  static fromListData(data: CamfilB2bUserData[]): CamfilB2bUser[] {
    if (data) {
      return data.map(CamfilB2bUserMapper.fromData);
    } else {
      throw new Error('camfilB2bUsersData is required');
    }
  }
}
