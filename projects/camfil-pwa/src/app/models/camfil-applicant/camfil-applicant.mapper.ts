import { CamfilApplicantData } from './camfil-applicant.interface';
import { CamfilApplicant } from './camfil-applicant.model';

export class CamfilApplicantMapper {
  static fromData(data: CamfilApplicantData): CamfilApplicant {
    if (!data) {
      throw new Error(`ApplicantData is required`);
    }

    return { ...data };
  }
}
