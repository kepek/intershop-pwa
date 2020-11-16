import { UnitHelper } from './unit.helper';
import { Unit } from './unit.model';

describe('Unit Helper', () => {
  describe('equal', () => {
    it.each([
      [false, undefined, undefined],
      [false, ({ ahu: 'test' } as unknown) as Unit, undefined],
      [false, undefined, ({ ahu: 'test' } as unknown) as Unit],
      [false, ({ ahu: 'test' } as unknown) as Unit, ({ ahu: 'other' } as unknown) as Unit],
      [true, ({ ahu: 'test' } as unknown) as Unit, ({ ahu: 'test' } as unknown) as Unit],
    ])(`should return %s when comparing %j and %j`, (expected, o1, o2) => {
      expect(UnitHelper.equal(o1, o2)).toEqual(expected);
    });
  });
});
