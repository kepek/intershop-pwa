import { TestBed } from '@angular/core/testing';

import { UnitData } from './unit.interface';
import { UnitMapper } from './unit.mapper';

describe('Unit Mapper', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  describe('fromData', () => {
    it('should throw when input is falsy', () => {
      expect(() => UnitMapper.fromData(undefined)).toThrow();
    });

    it('should map incoming data to model data', () => {
      const data = {
        AHU: {},
        AHUAirSlots: [],
      } as UnitData;
      const mapped = UnitMapper.fromData(data);
      expect(mapped).toHaveProperty('ahu', {});
      expect(mapped).toHaveProperty('ahuAirSlots', []);
    });
  });
});
