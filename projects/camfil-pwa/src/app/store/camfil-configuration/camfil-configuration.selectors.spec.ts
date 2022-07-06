import { TestBed } from '@angular/core/testing';
import { CamfilPwaStoreModule } from 'camfil-pwa/store/camfil-pwa-store.module';

import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { StoreWithSnapshots, provideStoreSnapshots } from 'ish-core/utils/dev/ngrx-testing';

import { loadCamfilConfigurationSuccess } from './camfil-configuration.actions';
import { getCamfilConfigurationParameter, isCamfilConfigurationInitialized } from './camfil-configuration.selectors';

describe('Camfil Configuration Selectors', () => {
  let store$: StoreWithSnapshots;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CamfilPwaStoreModule.forTesting('camfilConfiguration'), CoreStoreModule.forTesting()],
      providers: [provideStoreSnapshots()],
    });

    store$ = TestBed.inject(StoreWithSnapshots);
  });

  describe('initial state', () => {
    it('should be undefined or empty values for most selectors', () => {
      expect(isCamfilConfigurationInitialized(store$.state)).toBeFalsy();
      expect(getCamfilConfigurationParameter('use2ndAddressLineInOrderForm')(store$.state)).toMatchInlineSnapshot(
        `undefined`
      );
      expect(getCamfilConfigurationParameter('use2ndAddressLineInOrderForm')(store$.state)).toMatchInlineSnapshot(
        `undefined`
      );
    });
  });

  describe('after setting serverConfig', () => {
    beforeEach(() => {
      store$.dispatch(
        loadCamfilConfigurationSuccess({
          configuration: {
            icc: {
              apiBaseURL: 'http://example.org',
              apiToken: 'YYYY-YYYY',
            },
          },
        })
      );
    });

    it('should set serverConfig to state', () => {
      expect(isCamfilConfigurationInitialized(store$.state)).toBeTruthy();
      expect(getCamfilConfigurationParameter('use2ndAddressLineInOrderForm')(store$.state)).toMatchInlineSnapshot(
        `undefined`
      );
      expect(getCamfilConfigurationParameter('use2ndAddressLineInOrderForm')(store$.state)).toMatchInlineSnapshot(
        `undefined`
      );
    });
  });
});
