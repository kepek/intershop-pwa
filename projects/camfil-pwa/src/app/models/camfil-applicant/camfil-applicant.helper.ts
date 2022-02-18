import { CamfilApplicant } from './camfil-applicant.model';

export class CamfilApplicantHelper {
  static equal(camfilUser1: CamfilApplicant, camfilUser2: CamfilApplicant): boolean {
    return !!camfilUser1 && !!camfilUser2 && camfilUser1.firstName === camfilUser2.firstName;
  }
}
