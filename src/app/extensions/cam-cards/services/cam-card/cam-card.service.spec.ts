import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { anything, instance, mock, verify, when } from 'ts-mockito';

import { ApiService } from 'ish-core/services/api/api.service';

import { CamCardData } from '../../models/cam-card/cam-card.interface';
import { CamCard, CamCardHeader } from '../../models/cam-card/cam-card.model';

import { CamCardService } from './cam-card.service';

describe('Cam Card Service', () => {
  let apiServiceMock: ApiService;
  let camCardService: CamCardService;

  beforeEach(() => {
    apiServiceMock = mock(ApiService);
    TestBed.configureTestingModule({
      providers: [{ provide: ApiService, useFactory: () => instance(apiServiceMock) }],
    });
    camCardService = TestBed.inject(CamCardService);
  });

  it('should be created', () => {
    expect(camCardService).toBeTruthy();
  });

  it("should get cam cards when 'getCamCards' is called", done => {
    when(apiServiceMock.get('camcards')).thenReturn(of({ elements: [{ id: '1234' }] }));
    when(apiServiceMock.get('camcards/1234')).thenReturn(of({ id: '1234' }));

    camCardService.getCamCards().subscribe(data => {
      verify(apiServiceMock.get('camcards')).once();
      verify(apiServiceMock.get('camcards/1234')).once();
      expect(data).toMatchInlineSnapshot(`
        Array [
          Object {
            "delivery": Object {
              "interval": 10,
              "last": "12-01-2020",
            },
            "id": "1234",
            "itemsCount": 0,
            "maintenanceStatus": false,
            "subCamCards": Array [],
            "title": undefined,
          },
        ]
      `);
      done();
    });
  });

  it("should get an cam cards when 'getCamCard' is called", done => {
    when(apiServiceMock.get(`camcards/1234`)).thenReturn(of({ id: '1234' }));

    camCardService.getCamCard('1234').subscribe(() => {
      verify(apiServiceMock.get(`camcards/1234`)).once();
      done();
    });
  });

  it("should create an cam cards when 'createCamCard' is called", done => {
    const camCardId = '1234';
    const camCardHeader: CamCardHeader = { title: 'cam cards title' };
    when(apiServiceMock.post('camcards', anything())).thenReturn(
      of({ title: camCardId, id: camCardId } as CamCardData)
    );
    when(apiServiceMock.get('camcards/1234')).thenReturn(of({ id: '1234' }));

    camCardService.createCamCard(camCardHeader).subscribe(data => {
      expect(camCardId).toEqual(data.id);
      verify(apiServiceMock.post('camcards', anything())).once();
      done();
    });
  });

  it("should delete a cam cards when 'deleteCamCard' is called", done => {
    const camCardId = '1234';

    when(apiServiceMock.delete(`camcards/${camCardId}`)).thenReturn(of({}));

    camCardService.deleteCamCard(camCardId).subscribe(() => {
      verify(apiServiceMock.delete(`camcards/${camCardId}`)).once();
      done();
    });
  });

  it("should update a cam cards when 'updateCamCard' is called", done => {
    const camCard: CamCard = { id: '1234', title: 'cam cards title' };

    when(apiServiceMock.put(`camcards/${camCard.id}`, anything())).thenReturn(of({ camCard }));

    camCardService.updateCamCard(camCard).subscribe(data => {
      expect(camCard.id).toEqual(data.id);
      verify(apiServiceMock.put(`camcards/${camCard.id}`, anything())).once();
      done();
    });
  });

  it("should remove a product from a cam cards when 'removeItemFromCamCard' is called", done => {
    const camCardId = '1234';
    const camCardItemId = 'abcd';

    when(apiServiceMock.delete(`camcards/${camCardId}/products/${camCardItemId}`)).thenReturn(of({}));
    when(apiServiceMock.get(`camcards/${camCardId}`)).thenReturn(
      of({ title: 'cam cards title', id: '1234', rootCamCard: '' } as CamCardData)
    );

    camCardService.removeProductFromCamCard(camCardId, camCardItemId).subscribe(() => {
      verify(apiServiceMock.delete(`camcards/${camCardId}/products/${camCardItemId}`)).once();
      verify(apiServiceMock.get(`camcards/${camCardId}`)).once();
      done();
    });
  });
});
