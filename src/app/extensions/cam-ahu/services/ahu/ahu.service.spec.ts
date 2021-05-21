import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { anything, instance, mock, verify, when } from 'ts-mockito';

import { AppFacade } from 'ish-core/facades/app.facade';

import { ApiService as IccApiService } from '../../../cam-icc/services/api/api.service';

import { AhuService } from './ahu.service';

describe('Ahu Service', () => {
  let appFacade: AppFacade;
  let iccApiServiceMock: IccApiService;
  let ahuService: AhuService;

  beforeEach(() => {
    appFacade = mock(AppFacade);
    iccApiServiceMock = mock(IccApiService);

    when(appFacade.getCamfilChannel$).thenReturn(of('SE'));
    when(appFacade.getCountryByChannel$).thenReturn(of('SE'));

    TestBed.configureTestingModule({
      providers: [
        { provide: AppFacade, useFactory: () => instance(appFacade) },
        { provide: IccApiService, useFactory: () => instance(iccApiServiceMock) },
      ],
    });

    ahuService = TestBed.inject(AhuService);
  });

  it('should be created', () => {
    expect(ahuService).toBeTruthy();
  });

  it("should get the manufacturers when 'getManufacturers' is called", done => {
    when(iccApiServiceMock.post(`ahu/manufacturer`, anything())).thenReturn(of([]));

    ahuService.getManufacturers().subscribe(() => {
      verify(iccApiServiceMock.post(`ahu/manufacturer`, anything())).once();
      done();
    });
  });

  it("should get the manufacturer when 'getManufacturer' is called", done => {
    when(iccApiServiceMock.post(`ahu/manufacturer`, anything())).thenReturn(of({}));

    ahuService.getManufacturer('123').subscribe(() => {
      verify(iccApiServiceMock.post(`ahu/manufacturer`, anything())).once();
      done();
    });
  });

  it("should get the air handling units when 'getUnits' is called", done => {
    when(iccApiServiceMock.post(`ahu/unit`, anything())).thenReturn(of([]));

    ahuService.getUnits('123').subscribe(() => {
      verify(iccApiServiceMock.post(`ahu/unit`, anything())).once();
      done();
    });
  });

  it("should get the air handling unit when 'getUnit' is called", done => {
    when(iccApiServiceMock.post(`ahu/unit`, anything())).thenReturn(of({}));

    ahuService.getUnit('456').subscribe(() => {
      verify(iccApiServiceMock.post(`ahu/unit`, anything())).once();
      done();
    });
  });
});
