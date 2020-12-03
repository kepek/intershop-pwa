// tslint:disable: ish-ordered-imports project-structure ban-specific-imports

import { Link } from 'ish-core/models/link/link.model';

import { B2bUserData } from '../../../../../../projects/organization-management/src/app/models/b2b-user/b2b-user.interface';
import { CamfilB2bRoleData } from '../camfil-b2b-role/camfil-b2b-role.interface';

export type CamfilB2bUserData = B2bUserData & {
  id: string;
  userRoles: {
    type: string;
    userRoles: CamfilB2bRoleData[];
  };
};

export type CamfilB2bUserDataLink = Link & { id: string };
