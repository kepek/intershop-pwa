import { ApplicantHelper } from './applicant.helper';
import { Applicant } from './applicant.model';

describe('Applicant Helper', () => {
  describe('equal', () => {
    it.each([
      [false, undefined, undefined],
      [false, { firstName: 'test' }, undefined],
      [false, undefined, { firstName: 'test' }],
      [false, { firstName: 'test' }, { firstName: 'other' }],
      [true, { firstName: 'test' }, { firstName: 'test' }],
    ])('should yield %s when comparing %j and %j', (expected, app1: Applicant, app2: Applicant) => {
      expect(ApplicantHelper.equal(app1, app2)).toBe(expected);
    });
  });
});
