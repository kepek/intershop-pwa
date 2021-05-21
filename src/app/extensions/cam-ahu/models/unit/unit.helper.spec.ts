import { UnitHelper } from './unit.helper';
import { Unit } from './unit.model';

describe('Unit Helper', () => {
  describe('equal', () => {
    it.each([
      [false, undefined, undefined],
      [false, ({ ahu: { id: 'test' } } as unknown) as Unit, undefined],
      [false, undefined, ({ ahu: { id: 'test' } } as unknown) as Unit],
      [false, ({ ahu: { id: 'test' } } as unknown) as Unit, ({ ahu: { id: 'other' } } as unknown) as Unit],
      [true, ({ ahu: { id: 'test' } } as unknown) as Unit, ({ ahu: { id: 'test' } } as unknown) as Unit],
    ])(`should return %s when comparing %j and %j`, (expected, o1, o2) => {
      expect(UnitHelper.equal(o1, o2)).toEqual(expected);
    });
  });
});
