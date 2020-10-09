import { Applicant } from './applicant.model';

export class ApplicantHelper {
  static equal(camfilUser1: Applicant, camfilUser2: Applicant): boolean {
    return !!camfilUser1 && !!camfilUser2 && camfilUser1.firstName === camfilUser2.firstName;
  }
}
