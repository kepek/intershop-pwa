// tslint:disable: ish-ordered-imports ban-specific-imports
import { B2bRole } from '../../../../../../projects/organization-management/src/app/models/b2b-role/b2b-role.model';

export interface CamfilB2bRole extends B2bRole {
  customerId?: string;
  disabled?: boolean;
}
