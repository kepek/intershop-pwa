import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, Store } from '@ngrx/store';
import {
  CamfilChannelConfiguration,
  CamfilChannelSettings,
} from 'camfil-pwa/models/camfil-channel-configuration/camfil-channel-configuration.model';
import { CamfilConfigurationService } from 'camfil-pwa/services/camfil-configuration/camfil-configuration.service';
import { CamfilPwaStoreModule } from 'camfil-pwa/store/camfil-pwa-store.module';
import { cold, hot } from 'jest-marbles';
import { Observable, of, throwError } from 'rxjs';
import { instance, mock, when } from 'ts-mockito';

import { AppFacade } from 'ish-core/facades/app.facade';
import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { makeHttpError } from 'ish-core/utils/dev/api-service-utils';
import { routerTestNavigationAction } from 'ish-core/utils/dev/routing';

import {
  loadCamfilConfiguration,
  loadCamfilConfigurationFail,
  loadCamfilConfigurationSuccess,
} from './camfil-configuration.actions';
import { CamfilConfigurationEffects } from './camfil-configuration.effects';

describe('Camfil Configuration Effects', () => {
  let appFacade: AppFacade;
  let actions$: Observable<Action>;
  let effects: CamfilConfigurationEffects;
  let store$: Store;
  let camfilConfigurationServiceMock: CamfilConfigurationService;

  const settings: Partial<CamfilChannelSettings> = {
    showCountryFieldOnAddressForms: false,
    showAddToCamCardButtonForNonLoggedInUser: true,
  };

  const configuration: CamfilChannelConfiguration = {
    languages: ['sv_SE', 'en_GB'],
    channelCode: 'SE',
    currency: 'SEK',
    icmChannel: 'Camfil-CamfilSE-Site',
    continueShoppingUrl: '/account/camcards',
    ...settings,
  };

  beforeEach(() => {
    appFacade = mock(AppFacade);
    camfilConfigurationServiceMock = mock(CamfilConfigurationService);

    when(appFacade.getChannel$).thenReturn(of(configuration.channelCode));

    TestBed.configureTestingModule({
      imports: [CamfilPwaStoreModule.forTesting('camfilConfiguration'), CoreStoreModule.forTesting()],
      providers: [
        CamfilConfigurationEffects,
        provideMockActions(() => actions$),
        { provide: AppFacade, useFactory: () => instance(appFacade) },
        { provide: CamfilConfigurationService, useFactory: () => instance(camfilConfigurationServiceMock) },
      ],
    });

    effects = TestBed.inject(CamfilConfigurationEffects);
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
      when(camfilConfigurationServiceMock.getCamfilConfiguration()).thenReturn(of({}));
    });

    it('should map to action of type ApplyCamfilConfiguration', () => {
      const action = loadCamfilConfiguration();
      const completion = loadCamfilConfigurationSuccess({ configuration: {} });

      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadCamfilConfiguration$).toBeObservable(expected$);
    });

    it('should map invalid request to action of type loadCamfilConfigurationFail', () => {
      when(camfilConfigurationServiceMock.getCamfilConfiguration()).thenReturn(
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
