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
    when(apiServiceMock.get(`customers/-/users/-/wishlists`)).thenReturn(
      of({ elements: [{ uri: 'any/wishlists/1234' }] })
    );
    when(apiServiceMock.get(`customers/-/users/-/wishlists/1234`)).thenReturn(of({ id: '1234' }));

    camCardService.getCamCards().subscribe(data => {
      verify(apiServiceMock.get(`customers/-/users/-/wishlists`)).once();
      verify(apiServiceMock.get(`customers/-/users/-/wishlists/1234`)).once();
      expect(data).toMatchInlineSnapshot(`
        Array [
          Object {
            "creationDate": undefined,
            "id": "1234",
            "items": Array [],
            "itemsCount": 0,
            "title": undefined,
          },
        ]
      `);
      done();
    });
  });

  it("should get an cam cards when 'getCamCard' is called", done => {
    when(apiServiceMock.get(`customers/-/users/-/wishlists/1234`)).thenReturn(of({ id: '1234' }));

    camCardService.getCamCard('1234').subscribe(() => {
      verify(apiServiceMock.get(`customers/-/users/-/wishlists/1234`)).once();
      done();
    });
  });

  it("should create an cam cards when 'createCamCard' is called", done => {
    const camCardId = '1234';
    const camCardHeader: CamCardHeader = { title: 'cam cards title' };
    when(apiServiceMock.post(`customers/-/users/-/wishlists`, anything())).thenReturn(
      of({ title: camCardId } as CamCardData)
    );
    when(apiServiceMock.post(`customers/-/users/-/wishlists`, anything())).thenReturn(
      of({ title: camCardId } as CamCardData)
    );
    when(apiServiceMock.get(`customers/-/users/-/wishlists/1234`)).thenReturn(of({ id: '1234' }));

    camCardService.createCamCard(camCardHeader).subscribe(data => {
      expect(camCardId).toEqual(data.id);
      verify(apiServiceMock.post(`customers/-/users/-/wishlists`, anything())).once();
      done();
    });
  });

  it("should delete a cam cards when 'deleteCamCard' is called", done => {
    const camCardId = '1234';

    when(apiServiceMock.delete(`customers/-/users/-/wishlists/${camCardId}`)).thenReturn(of({}));

    camCardService.deleteCamCard(camCardId).subscribe(() => {
      verify(apiServiceMock.delete(`customers/-/users/-/wishlists/${camCardId}`)).once();
      done();
    });
  });

  it("should update a cam cards when 'updateCamCard' is called", done => {
    const camCard: CamCard = { id: '1234', title: 'cam cards title' };

    when(apiServiceMock.put(`customers/-/users/-/wishlists/${camCard.id}`, anything())).thenReturn(of({ camCard }));

    camCardService.updateCamCard(camCard).subscribe(data => {
      expect(camCard.id).toEqual(data.id);
      verify(apiServiceMock.put(`customers/-/users/-/wishlists/${camCard.id}`, anything())).once();
      done();
    });
  });

  it("should remove a product from a cam cards when 'removeItemFromCamCard' is called", done => {
    const camCardId = '1234';
    const sku = 'abcd';

    when(apiServiceMock.delete(`customers/-/users/-/wishlists/${camCardId}/products/${sku}`)).thenReturn(of({}));
    when(apiServiceMock.get(`customers/-/users/-/wishlists/${camCardId}`)).thenReturn(
      of({ title: 'cam cards title' } as CamCardData)
    );

    camCardService.removeProductFromCamCard(camCardId, sku).subscribe(() => {
      verify(apiServiceMock.delete(`customers/-/users/-/wishlists/${camCardId}/products/${sku}`)).once();
      verify(apiServiceMock.get(`customers/-/users/-/wishlists/${camCardId}`)).once();
      done();
    });
  });
});
