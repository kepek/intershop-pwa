import { ManufacturerHelper } from './manufacturer.helper';
import { Manufacturer } from './manufacturer.model';

describe('Manufacturer Helper', () => {
  describe('equal', () => {
    it.each([
      [false, undefined, undefined],
      [false, ({ id: 'test' } as unknown) as Manufacturer, undefined],
      [false, undefined, ({ id: 'test' } as unknown) as Manufacturer],
      [false, ({ id: 'test' } as unknown) as Manufacturer, ({ id: 'other' } as unknown) as Manufacturer],
      [true, ({ id: 'test' } as unknown) as Manufacturer, ({ id: 'test' } as unknown) as Manufacturer],
    ])(`should return %s when comparing %j and %j`, (expected, o1, o2) => {
      expect(ManufacturerHelper.equal(o1, o2)).toEqual(expected);
    });
  });
});
