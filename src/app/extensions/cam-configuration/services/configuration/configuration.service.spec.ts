import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { anything, instance, mock, verify, when } from 'ts-mockito';

import { AppFacade } from 'ish-core/facades/app.facade';
import { ApiService } from 'ish-core/services/api/api.service';

import { ConfigurationService } from './configuration.service';

describe('Configuration Service', () => {
  let appFacade: AppFacade;
  let apiServiceMock: ApiService;
  let configurationService: ConfigurationService;

  beforeEach(() => {
    appFacade = mock(AppFacade);
    apiServiceMock = mock(ApiService);

    when(appFacade.getChannel$).thenReturn(of('SE'));

    TestBed.configureTestingModule({
      providers: [
        { provide: ApiService, useFactory: () => instance(apiServiceMock) },
        {
          provide: AppFacade,
          useFactory: () => instance(appFacade),
        },
      ],
    });
    configurationService = TestBed.inject(ConfigurationService);
    configurationService.mode = 'server';
  });

  it('should be created', () => {
    expect(configurationService).toBeTruthy();
  });

  it("should get the camfil server configuration when 'getCamfilConfiguration' is called", done => {
    when(apiServiceMock.get(`camfil_configurations`, anything())).thenReturn(of({}));

    configurationService.getCamfilConfiguration().subscribe(() => {
      verify(apiServiceMock.get(`camfil_configurations`, anything())).once();
      done();
    });
  });
});
