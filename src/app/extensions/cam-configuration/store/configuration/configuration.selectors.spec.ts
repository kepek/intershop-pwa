import { TestBed } from '@angular/core/testing';

import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { StoreWithSnapshots, provideStoreSnapshots } from 'ish-core/utils/dev/ngrx-testing';

import { CamConfigurationStoreModule } from '../cam-configuration-store.module';

import { loadCamfilConfigurationSuccess } from './configuration.actions';
import { getCamfilConfigurationParameter, isCamfilConfigurationInitialized } from './configuration.selectors';

describe('Configuration Selectors', () => {
  let store$: StoreWithSnapshots;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CamConfigurationStoreModule.forTesting('configuration'), CoreStoreModule.forTesting()],
      providers: [provideStoreSnapshots()],
    });

    store$ = TestBed.inject(StoreWithSnapshots);
  });

  describe('initial state', () => {
    it('should be undefined or empty values for most selectors', () => {
      expect(isCamfilConfigurationInitialized(store$.state)).toBeFalsy();
      expect(getCamfilConfigurationParameter('useSecondAddressLine')(store$.state)).toMatchInlineSnapshot(`undefined`);
      expect(getCamfilConfigurationParameter('useSecondAddressLine')(store$.state)).toMatchInlineSnapshot(`undefined`);
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
      expect(getCamfilConfigurationParameter('useSecondAddressLine')(store$.state)).toMatchInlineSnapshot(`undefined`);
      expect(getCamfilConfigurationParameter('useSecondAddressLine')(store$.state)).toMatchInlineSnapshot(`undefined`);
    });
  });
});
