import * as using from 'jasmine-data-provider';

import { ApplicantHelper } from './applicant.helper';
import { Applicant } from './applicant.model';

describe('Applicant Helper', () => {
  describe('equal', () => {
    using(
      [
        { o1: undefined, o2: undefined, expected: false },
        { o1: { firstName: 'test' } as Applicant, o2: undefined, expected: false },
        { o1: undefined, o2: { firstName: 'test' } as Applicant, expected: false },
        { o1: { firstName: 'test' } as Applicant, o2: { firstName: 'other' } as Applicant, expected: false },
        { o1: { firstName: 'test' } as Applicant, o2: { firstName: 'test' } as Applicant, expected: true },
      ],
      slice => {
        it(`should return ${slice.expected} when comparing ${JSON.stringify(slice.o1)} and ${JSON.stringify(
          slice.o2
        )}`, () => {
          expect(ApplicantHelper.equal(slice.o1, slice.o2)).toEqual(slice.expected);
        });
      }
    );
  });
});
