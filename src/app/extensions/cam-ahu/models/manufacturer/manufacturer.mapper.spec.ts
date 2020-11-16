import { TestBed } from '@angular/core/testing';

import { ManufacturerData } from './manufacturer.interface';
import { ManufacturerMapper } from './manufacturer.mapper';

describe('Manufacturer Mapper', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  describe('fromData', () => {
    it('should throw when input is falsy', () => {
      expect(() => ManufacturerMapper.fromListData(undefined)).toThrow();
    });

    it('should map incoming data to model data', () => {
      const data = [
        {
          Name: 'test',
          Id: 123,
        },
      ] as ManufacturerData[];
      const mapped = ManufacturerMapper.fromListData(data);
      expect(mapped[0]).toHaveProperty('name', 'test');
      expect(mapped[0]).toHaveProperty('id', '123');
    });
  });
});
