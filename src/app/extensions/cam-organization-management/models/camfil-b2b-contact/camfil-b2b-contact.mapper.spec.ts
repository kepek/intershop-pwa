import { TestBed } from '@angular/core/testing';

import { CamfilB2bContactData } from './camfil-b2b-contact.interface';
import { CamfilB2bContactMapper } from './camfil-b2b-contact.mapper';

describe('Camfil B2b Contact Mapper', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  describe('fromData', () => {
    it('should throw when input is falsy', () => {
      expect(() => CamfilB2bContactMapper.fromData(undefined)).toThrow();
    });

    it('should map incoming data to model data', () => {
      const data = {
        profileId: 'test',
      } as CamfilB2bContactData;
      const mapped = CamfilB2bContactMapper.fromData(data);
      expect(mapped).toHaveProperty('profileId', 'test');
      expect(mapped).not.toHaveProperty('otherField');
    });
  });
});
