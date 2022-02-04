import { CamfilApplicantData } from './camfil-applicant.interface';
import { CamfilApplicantMapper } from './camfil-applicant.mapper';

describe('Camfil Applicant Mapper', () => {
  describe('fromData', () => {
    it('should throw when input is falsy', () => {
      expect(() => CamfilApplicantMapper.fromData(undefined)).toThrow();
    });

    it(`should return Applicant when getting ApplicantData`, () => {
      const applicantData: CamfilApplicantData = {
        firstName: 'Patricia',
        lastName: 'Miller',
        email: 'pmiller@test.intershop.de',
        customerName: 'Intershop',
      };
      const applicant = CamfilApplicantMapper.fromData(applicantData);

      expect(applicant).toBeTruthy();
      expect(applicant.firstName).toBe(applicantData.firstName);
      expect(applicant.lastName).toBe(applicantData.lastName);
      expect(applicant.email).toBe(applicantData.email);
      expect(applicant.customerName).toBe(applicantData.customerName);
    });
  });
});
