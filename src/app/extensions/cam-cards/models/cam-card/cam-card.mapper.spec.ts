import { TestBed } from '@angular/core/testing';

import { CamCardData } from './cam-card.interface';
import { CamCardMapper } from './cam-card.mapper';
import { CamCard } from './cam-card.model';

describe('Cam Card Mapper', () => {
  let camCardMapper: CamCardMapper;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    camCardMapper = TestBed.inject(CamCardMapper);
  });

  describe('fromData', () => {
    it('should throw when input is falsy', () => {
      expect(() => camCardMapper.fromData(undefined)).toThrow();
    });

    it('should map incoming data to cam cards model data', () => {
      const camCardData: CamCardData = {
        id: '1234',
        subCamCards: [],
        name: 'cam cards title',
        camCardItems: [{ sku: '123456', camCardItemId: 'camCardItemId', creationDate: 12345818123 }],
      };
      const mapped = camCardMapper.fromData(camCardData);
      expect(mapped).toHaveProperty('id', '1234');
      expect(mapped).toHaveProperty('title', 'cam cards title');
      expect(mapped).toHaveProperty('camCardItems', [
        {
          sku: '123456',
          camCardItemId: 'camCardItemId',
          creationDate: 12345818123,
        },
      ]);
    });
  });

  describe('Cam Card Mapper', () => {
    it('should map incoming data to cam cards', () => {
      const camCardId = '1234';

      const updateCamCardData: CamCard = {
        id: camCardId,
        title: 'title',
      };
      const mapped = camCardMapper.fromUpdate(updateCamCardData, camCardId);

      expect(mapped).toHaveProperty('id', camCardId);
      expect(mapped).toHaveProperty('title', 'title');
    });
  });
});
