import { CamfilApplicantHelper } from './camfil-applicant.helper';
import { CamfilApplicant } from './camfil-applicant.model';

describe('Camfil Applicant Helper', () => {
  describe('equal', () => {
    it.each([
      [false, undefined, undefined],
      [false, { firstName: 'test' }, undefined],
      [false, undefined, { firstName: 'test' }],
      [false, { firstName: 'test' }, { firstName: 'other' }],
      [true, { firstName: 'test' }, { firstName: 'test' }],
    ])('should yield %s when comparing %j and %j', (expected, app1: CamfilApplicant, app2: CamfilApplicant) => {
      expect(CamfilApplicantHelper.equal(app1, app2)).toBe(expected);
    });
  });
});
