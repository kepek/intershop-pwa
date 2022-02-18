import { TestBed } from '@angular/core/testing';
import { instance, mock } from 'ts-mockito';

import { ApiService } from 'ish-core/services/api/api.service';

import { CamfilUserService } from './camfil-user.service';

describe('Camfil User Service', () => {
  let apiServiceMock: ApiService;
  let camfilUserService: CamfilUserService;

  beforeEach(() => {
    apiServiceMock = mock(ApiService);
    TestBed.configureTestingModule({
      providers: [{ provide: ApiService, useFactory: () => instance(apiServiceMock) }],
    });
    camfilUserService = TestBed.inject(CamfilUserService);
  });

  it('should be created', () => {
    expect(camfilUserService).toBeTruthy();
  });
});
