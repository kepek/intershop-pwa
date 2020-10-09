import { TestBed } from '@angular/core/testing';
import { instance, mock } from 'ts-mockito';

import { ApiService } from 'ish-core/services/api/api.service';

import { CamAccountService } from './cam-account.service';

describe('Cam Account Service', () => {
  let apiServiceMock: ApiService;
  let camAccountService: CamAccountService;

  beforeEach(() => {
    apiServiceMock = mock(ApiService);
    TestBed.configureTestingModule({
      providers: [{ provide: ApiService, useFactory: () => instance(apiServiceMock) }],
    });
    camAccountService = TestBed.inject(CamAccountService);
  });

  it('should be created', () => {
    expect(camAccountService).toBeTruthy();
  });
});
