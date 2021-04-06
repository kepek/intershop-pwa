import { CamfilB2bUserData } from './camfil-b2b-user.interface';
import { CamfilB2bUser } from './camfil-b2b-user.model';

export class CamfilB2bUserMapper {
  static fromData(camfilB2bUserData: CamfilB2bUserData): CamfilB2bUser {
    if (camfilB2bUserData) {
      const { active, userRoles, ...rest } = camfilB2bUserData;
      const roleIDs = userRoles?.userRoles?.map(role => role.roleID);

      return {
        ...rest,
        roleIDs,
        active: active && JSON.parse(String(active)),
      };
    } else {
      throw new Error('CamfilB2bUserData is required');
    }
  }

  static fromListData(camfilB2bUsersData: CamfilB2bUserData[]): CamfilB2bUser[] {
    if (camfilB2bUsersData) {
      return camfilB2bUsersData.map(CamfilB2bUserMapper.fromData);
    } else {
      throw new Error('camfilB2bUsersData is required');
    }
  }
}
