import { CamfilB2bContactHelper } from './camfil-b2b-contact.helper';
import { CamfilB2bContact } from './camfil-b2b-contact.model';

describe('Camfil B2b Contact Helper', () => {
  describe('equal', () => {
    it.each([
      [false, undefined, undefined],
      [false, { profileId: 'test' } as CamfilB2bContact, undefined],
      [false, undefined, { profileId: 'test' } as CamfilB2bContact],
      [false, { profileId: 'test' } as CamfilB2bContact, { profileId: 'other' } as CamfilB2bContact],
      [true, { profileId: 'test' } as CamfilB2bContact, { profileId: 'test' } as CamfilB2bContact],
    ])(`should return %s when comparing %j and %j`, (expected, o1, o2) => {
      expect(CamfilB2bContactHelper.equal(o1, o2)).toEqual(expected);
    });
  });
});
