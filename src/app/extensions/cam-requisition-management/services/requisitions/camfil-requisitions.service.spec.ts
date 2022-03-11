import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { anything, instance, mock, verify, when } from 'ts-mockito';

import { ApiService } from 'ish-core/services/api/api.service';

import { CamfilRequisitionsService } from './camfil-requisitions.service';

describe('Camfil Requisitions Service', () => {
  let apiServiceMock: ApiService;
  let requisitionsService: CamfilRequisitionsService;

  beforeEach(() => {
    apiServiceMock = mock(ApiService);
    when(apiServiceMock.b2bUserEndpoint()).thenReturn(instance(apiServiceMock));
    TestBed.configureTestingModule({
      providers: [{ provide: ApiService, useFactory: () => instance(apiServiceMock) }],
    });
    requisitionsService = TestBed.inject(CamfilRequisitionsService);

    when(apiServiceMock.get(anything(), anything())).thenReturn(of({ data: {} }));
    when(apiServiceMock.patch(anything(), anything(), anything())).thenReturn(of({ data: {} }));
  });

  it('should be created', () => {
    expect(requisitionsService).toBeTruthy();
  });

  it('should call the getCamfilRequisitions of customer API when fetching requisitions', done => {
    requisitionsService.getCamfilRequisitions('buyer').subscribe(data => {
      verify(apiServiceMock.get('camfilrequisitions', anything())).once();
      expect(data).toMatchInlineSnapshot(`undefined`);
      done();
    });
  });

  it('should call getCamfilRequisition of customer API when fetching a requisition', done => {
    requisitionsService.getCamfilRequisition('4712').subscribe(() => {
      verify(apiServiceMock.get('camfilrequisitions/4712', anything())).once();
      done();
    });
  });

  it('should call updateCamfilRequisitionStatus of customer API when patching a requisition status', done => {
    requisitionsService.updateCamfilRequisitionStatus('4712', 'APPROVED').subscribe(() => {
      verify(apiServiceMock.patch('camfilrequisitions/4712/approve', anything(), anything())).once();
      done();
    });
  });
});
