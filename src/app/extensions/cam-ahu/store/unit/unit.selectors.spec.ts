import { TestBed } from '@angular/core/testing';

import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { makeHttpError } from 'ish-core/utils/dev/api-service-utils';
import { StoreWithSnapshots, provideStoreSnapshots } from 'ish-core/utils/dev/ngrx-testing';

import { CamAhuStoreModule } from '../cam-ahu-store.module';

import { loadAhuUnits, loadAhuUnitsFail, loadAhuUnitsSuccess } from './unit.actions';
import { units } from './unit.mock';
import { getAhuUnitsError, getAhuUnitsLoading, getAllAhuUnits, getSelectedAhuUnitId } from './unit.selectors';

describe('Unit Selectors', () => {
  let store$: StoreWithSnapshots;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CamAhuStoreModule.forTesting('units'), CoreStoreModule.forTesting()],
      providers: [provideStoreSnapshots()],
    });

    store$ = TestBed.inject(StoreWithSnapshots);
  });

  describe('initial state', () => {
    it('should not be loading when in initial state', () => {
      expect(getAhuUnitsLoading(store$.state)).toBeFalse();
    });
    it('should not have a selected ahu unit when in initial state', () => {
      expect(getSelectedAhuUnitId(store$.state)).toBeUndefined();
    });
    it('should not have an error when in initial state', () => {
      expect(getAhuUnitsError(store$.state)).toBeUndefined();
    });
  });

  describe('loading ahu unit', () => {
    describe('LoadUnit', () => {
      const loadUnitAction = loadAhuUnits({ manufacturerId: '56564' });

      beforeEach(() => {
        store$.dispatch(loadUnitAction);
      });

      it('should set loading to true', () => {
        expect(getAhuUnitsLoading(store$.state)).toBeTrue();
      });
    });

    describe('LoadUnitSuccess', () => {
      const loadUnitSuccessAction = loadAhuUnitsSuccess({ units });

      beforeEach(() => {
        store$.dispatch(loadUnitSuccessAction);
      });

      it('should set loading to false', () => {
        expect(getAhuUnitsLoading(store$.state)).toBeFalse();
      });

      it('should add ahu unit to state', () => {
        expect(getAllAhuUnits(store$.state)).toEqual(units);
      });
    });

    describe('LoadUnitFail', () => {
      const loadUnitFailAction = loadAhuUnitsFail({ error: makeHttpError({ message: 'invalid' }) });

      beforeEach(() => {
        store$.dispatch(loadUnitFailAction);
      });

      it('should set loading to false', () => {
        expect(getAhuUnitsLoading(store$.state)).toBeFalse();
      });

      it('should add the error to state', () => {
        expect(getAhuUnitsError(store$.state)).toMatchInlineSnapshot(`
          Object {
            "message": "invalid",
            "name": "HttpErrorResponse",
          }
        `);
      });
    });
  });
});
