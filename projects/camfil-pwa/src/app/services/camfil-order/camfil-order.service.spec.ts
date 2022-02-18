import { TestBed } from '@angular/core/testing';
import { instance, mock } from 'ts-mockito';

import { ApiService } from 'ish-core/services/api/api.service';

import { CamfilOrderService } from './camfil-order.service';

describe('Camfil Order Service', () => {
  let apiServiceMock: ApiService;
  let orderService: CamfilOrderService;

  beforeEach(() => {
    apiServiceMock = mock(ApiService);
    TestBed.configureTestingModule({
      providers: [{ provide: ApiService, useFactory: () => instance(apiServiceMock) }],
    });
    orderService = TestBed.inject(CamfilOrderService);
  });

  it('should be created', () => {
    expect(orderService).toBeTruthy();
  });
});
