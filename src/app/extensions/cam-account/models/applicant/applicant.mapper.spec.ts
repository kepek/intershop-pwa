import { ApplicantData } from './applicant.interface';
import { ApplicantMapper } from './applicant.mapper';

describe('Applicant Mapper', () => {
  describe('fromData', () => {
    it('should throw when input is falsy', () => {
      expect(() => ApplicantMapper.fromData(undefined)).toThrow();
    });

    it(`should return Applicant when getting ApplicantData`, () => {
      const applicantData: ApplicantData = {
        firstName: 'Patricia',
        lastName: 'Miller',
        email: 'pmiller@test.intershop.de',
        customerName: 'Intershop',
      };
      const applicant = ApplicantMapper.fromData(applicantData);

      expect(applicant).toBeTruthy();
      expect(applicant.firstName).toBe(applicantData.firstName);
      expect(applicant.lastName).toBe(applicantData.lastName);
      expect(applicant.email).toBe(applicantData.email);
      expect(applicant.customerName).toBe(applicantData.customerName);
    });
  });
});
