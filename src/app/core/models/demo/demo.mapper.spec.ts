import { TestBed } from '@angular/core/testing';

import { DemoData } from './demo.interface';
import { DemoMapper } from './demo.mapper';

describe('Demo Mapper', () => {
  let demoMapper: DemoMapper;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    demoMapper = TestBed.inject(DemoMapper);
  });

  describe('fromData', () => {
    it('should throw when input is falsy', () => {
      expect(() => demoMapper.fromData(undefined)).toThrow();
    });

    it('should map incoming data to model data', () => {
      const data: DemoData = {
        incomingField: 'test',
        otherField: false,
      };
      const mapped = demoMapper.fromData(data);
      expect(mapped).toHaveProperty('id', 'test');
      expect(mapped).not.toHaveProperty('otherField');
    });
  });
});
