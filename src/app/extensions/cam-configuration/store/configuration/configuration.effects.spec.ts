import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, Store } from '@ngrx/store';
import { cold, hot } from 'jest-marbles';
import { Observable, of, throwError } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { AppFacade } from 'ish-core/facades/app.facade';
import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { makeHttpError } from 'ish-core/utils/dev/api-service-utils';
import { routerTestNavigationAction } from 'ish-core/utils/dev/routing';

import { ConfigurationService } from '../../services/configuration/configuration.service';
import { ChannelConfiguration, ChannelSettings } from '../../settings';
import { CamConfigurationStoreModule } from '../cam-configuration-store.module';

import {
  loadCamfilConfiguration,
  loadCamfilConfigurationFail,
  loadCamfilConfigurationSuccess,
} from './configuration.actions';
import { ConfigurationEffects } from './configuration.effects';

describe('Configuration Effects', () => {
  let appFacade: AppFacade;
  let actions$: Observable<Action>;
  let effects: ConfigurationEffects;
  let store$: Store;
  let configurationServiceMock: ConfigurationService;

  const settings: Partial<ChannelSettings> = {
    showCountryFieldOnAddressForms: false,
    showAddToCamCardButtonForNonLoggedInUser: true,
  };

  const configuration: ChannelConfiguration = {
    countryCode: 'SE',
    currency: 'SEK',
    icmChannel: 'Camfil-CamfilSE-Site',
    ...settings,
  };

  beforeEach(() => {
    appFacade = mock(AppFacade);
    configurationServiceMock = mock(ConfigurationService);

    when(appFacade.getChannel$).thenReturn(of(configuration.countryCode));

    TestBed.configureTestingModule({
      imports: [CamConfigurationStoreModule.forTesting('configuration'), CoreStoreModule.forTesting()],
      providers: [
        ConfigurationEffects,
        provideMockActions(() => actions$),
        { provide: AppFacade, useFactory: () => instance(appFacade) },
        { provide: ConfigurationService, useFactory: () => instance(configurationServiceMock) },
      ],
    });

    effects = TestBed.inject(ConfigurationEffects);
    store$ = TestBed.inject(Store);
  });

  describe('loadCamfilConfigurationOnInit$', () => {
    it('should trigger the loading of configuration data on the first page', () => {
      const action = routerTestNavigationAction({});
      const expected = loadCamfilConfiguration();

      actions$ = hot('a', { a: action });
      expect(effects.loadCamfilConfigurationOnInit$).toBeObservable(cold('a', { a: expected }));
    });

    it('should not trigger the loading of config data on the second page', () => {
      store$.dispatch(
        loadCamfilConfigurationSuccess({
          configuration: { lorem: 'ipsum' },
        })
      );

      const action = routerTestNavigationAction({});
      actions$ = hot('        ----a---a--a', { a: action });
      const expected$ = cold('------------');

      expect(effects.loadCamfilConfigurationOnInit$).toBeObservable(expected$);
    });
  });

  describe('loadCamfilConfiguration$', () => {
    beforeEach(() => {
      when(configurationServiceMock.getCamfilConfiguration()).thenReturn(of({}));
    });

    it('should map to action of type ApplyCamfilConfiguration', () => {
      const action = loadCamfilConfiguration();
      const completion = loadCamfilConfigurationSuccess({ configuration: {} });

      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadCamfilConfiguration$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type loadCamfilConfigurationFail', () => {
      when(configurationServiceMock.getCamfilConfiguration()).thenReturn(
        throwError(makeHttpError({ message: 'invalid' }))
      );

      const action = loadCamfilConfiguration();
      const completion = loadCamfilConfigurationFail({ error: makeHttpError({ message: 'invalid' }) });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadCamfilConfiguration$).toBeObservable(expected$);
    });
  });
});
