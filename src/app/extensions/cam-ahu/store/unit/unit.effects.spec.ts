import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { cold, hot } from 'jest-marbles';
import { of, throwError } from 'rxjs';
import { instance, mock, verify, when } from 'ts-mockito';

import { FeatureToggleModule } from 'ish-core/feature-toggle.module';
import { makeHttpError } from 'ish-core/utils/dev/api-service-utils';

import { AhuService } from '../../services/ahu/ahu.service';

import {
  loadAhuUnit,
  loadAhuUnitFail,
  loadAhuUnitSuccess,
  loadAhuUnits,
  loadAhuUnitsFail,
  loadAhuUnitsSuccess,
} from './unit.actions';
import { UnitEffects } from './unit.effects';
import { units } from './unit.mock';

describe('Unit Effects', () => {
  let actions$;
  let ahuService: AhuService;
  let effects: UnitEffects;

  beforeEach(() => {
    ahuService = mock(AhuService);

    TestBed.configureTestingModule({
      imports: [FeatureToggleModule.forTesting('camAhu'), RouterTestingModule],
      providers: [
        UnitEffects,
        provideMockActions(() => actions$),
        provideMockStore(),
        { provide: AhuService, useFactory: () => instance(ahuService) },
      ],
    });

    effects = TestBed.inject(UnitEffects);
  });

  describe('loadUnits$', () => {
    beforeEach(() => {
      when(ahuService.getUnits('56564')).thenReturn(of(units));
    });

    it('should call the AhuService for loadUnits', done => {
      const action = loadAhuUnits({ manufacturerId: '56564' });
      actions$ = of(action);

      effects.loadAhuUnits$.subscribe(() => {
        verify(ahuService.getUnits('56564')).once();
        done();
      });
    });

    it('should map to actions of type LoadAhuUnitsSuccess', () => {
      const action = loadAhuUnits({ manufacturerId: '56564' });
      const completion = loadAhuUnitsSuccess({
        units,
      });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadAhuUnits$).toBeObservable(expected$);
    });

    it('should map failed calls to actions of type LoadAhuUnitsFail', () => {
      const error = makeHttpError({ message: 'invalid' });
      when(ahuService.getUnits('56564')).thenReturn(throwError(error));
      const action = loadAhuUnits({ manufacturerId: '56564' });
      const completion = loadAhuUnitsFail({
        error,
      });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadAhuUnits$).toBeObservable(expected$);
    });
  });

  describe('loadUnit$', () => {
    beforeEach(() => {
      when(ahuService.getUnit('123454')).thenReturn(of(units[0]));
    });

    it('should call the AhuService for loadUnit', done => {
      const action = loadAhuUnit({ unitId: '123454' });
      actions$ = of(action);

      effects.loadAhuUnit$.subscribe(() => {
        verify(ahuService.getUnit('123454')).once();
        done();
      });
    });

    it('should map to actions of type LoadAhuUnitSuccess', () => {
      const action = loadAhuUnit({ unitId: '123454' });
      const completion = loadAhuUnitSuccess({
        unit: units[0],
      });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadAhuUnit$).toBeObservable(expected$);
    });

    it('should map failed calls to actions of type LoadAhuUnitFail', () => {
      const error = makeHttpError({ message: 'invalid' });
      when(ahuService.getUnit('123454')).thenReturn(throwError(error));
      const action = loadAhuUnit({ unitId: '123454' });
      const completion = loadAhuUnitFail({
        error,
      });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadAhuUnit$).toBeObservable(expected$);
    });
  });
});
