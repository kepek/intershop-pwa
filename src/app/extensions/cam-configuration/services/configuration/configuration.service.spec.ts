import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { of } from 'rxjs';
import { first } from 'rxjs/operators';
import { anything, instance, mock, verify, when } from 'ts-mockito';

import { AppFacade } from 'ish-core/facades/app.facade';
import { ApiService } from 'ish-core/services/api/api.service';

import { ChannelConfiguration } from '../../models/channel-configuration/channel-configuration.model';
import { getConfigurationState } from '../../store/configuration';

import { ConfigurationService } from './configuration.service';

describe('Configuration Service', () => {
  let appFacade: AppFacade;
  let apiServiceMock: ApiService;
  let configurationService: ConfigurationService;

  const configuration: ChannelConfiguration = {
    countryCode: 'SE',
    currency: 'SEK',
    icmChannel: 'Camfil-CamfilSE-Site',
    showCountryFieldOnAddressForms: false,
    showAddToCamCardButtonForNonLoggedInUser: true,
  };

  beforeEach(() => {
    appFacade = mock(AppFacade);
    apiServiceMock = mock(ApiService);

    when(appFacade.getChannel$).thenReturn(of('SE'));

    TestBed.configureTestingModule({
      providers: [
        { provide: ApiService, useFactory: () => instance(apiServiceMock) },
        { provide: AppFacade, useFactory: () => instance(appFacade) },
        provideMockStore({
          selectors: [{ selector: getConfigurationState, value: configuration }],
        }),
      ],
    });
    configurationService = TestBed.inject(ConfigurationService);
    configurationService.mode = 'server';
  });

  it('should be created', () => {
    expect(configurationService).toBeTruthy();
  });

  it('should report channelSetting as deactivated, when no setting is defined', async () => {
    await expect(configurationService.isEnabled('FR').pipe(first()).toPromise()).resolves.toBeFalse();
  });

  it("should get the camfil server configuration when 'getCamfilConfiguration' is called", done => {
    when(apiServiceMock.get(`camfil_configurations`, anything())).thenReturn(of({}));

    configurationService.getCamfilConfiguration().subscribe(() => {
      verify(apiServiceMock.get(`camfil_configurations`, anything())).once();
      done();
    });
  });
});
