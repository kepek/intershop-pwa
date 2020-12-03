export interface CamfilB2bContactRelations {
  customerIDs?: string[];
  userIDs?: string[];
}

export const camfilB2bContactRelationsKeys = ['customerIDs', 'userIDs'];

export interface CamfilB2bContact extends CamfilB2bContactRelations {
  profileId: string;
  email: string;
  firstName: string;
  lastName: string;
  erpId: string;
  fullName: string;
}
