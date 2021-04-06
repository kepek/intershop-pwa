import { CamfilB2bContact } from './camfil-b2b-contact.model';

export class CamfilB2bContactHelper {
  static equal(camfilB2bContact1: CamfilB2bContact, camfilB2bContact2: CamfilB2bContact): boolean {
    return !!camfilB2bContact1 && !!camfilB2bContact2 && camfilB2bContact1.profileId === camfilB2bContact2.profileId;
  }
}
