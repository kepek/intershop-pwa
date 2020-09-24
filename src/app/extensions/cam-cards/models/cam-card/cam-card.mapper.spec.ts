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
      expect(() => camCardMapper.fromData(undefined, undefined)).toThrow();
    });

    it('should map incoming data to cam cards model data', () => {
      const camCardData: CamCardData = {
        title: 'cam cards title',
        itemsCount: 3,
        items: [
          {
            attributes: [
              { name: 'sku', value: '123456' },
              { name: 'id', value: 'camCardItemId' },
              { name: 'creationDate', value: '12345818123' },
              {
                name: 'desiredQuantity',
                value: {
                  value: 2,
                  unit: '',
                },
              },
            ],
          },
        ],
      };
      const mapped = camCardMapper.fromData(camCardData, '1234');
      expect(mapped).toHaveProperty('id', '1234');
      expect(mapped).toHaveProperty('title', 'cam cards title');
      expect(mapped).toHaveProperty('items', [
        { sku: '123456', id: 'camCardItemId', creationDate: 12345818123, desiredQuantity: { value: 2 } },
      ]);
    });
  });

  describe('fromUpdate', () => {
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
