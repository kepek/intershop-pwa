import { TestBed } from '@angular/core/testing';
import { instance, mock } from 'ts-mockito';

import { ApiService } from 'ish-core/services/api/api.service';

import { OrderService } from './order.service';

describe('Order Service', () => {
  let apiServiceMock: ApiService;
  let orderService: OrderService;

  beforeEach(() => {
    apiServiceMock = mock(ApiService);
    TestBed.configureTestingModule({
      providers: [{ provide: ApiService, useFactory: () => instance(apiServiceMock) }],
    });
    orderService = TestBed.inject(OrderService);
  });

  it('should be created', () => {
    expect(orderService).toBeTruthy();
  });
});
