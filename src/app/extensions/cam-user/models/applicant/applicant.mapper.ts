import { ApplicantData } from './applicant.interface';
import { Applicant } from './applicant.model';

export class ApplicantMapper {
  static fromData(data: ApplicantData): Applicant {
    if (!data) {
      throw new Error(`ApplicantData is required`);
    }

    return { ...data };
  }
}
