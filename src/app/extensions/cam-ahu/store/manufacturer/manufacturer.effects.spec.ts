import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { cold, hot } from 'jest-marbles';
import { of, throwError } from 'rxjs';
import { instance, mock, verify, when } from 'ts-mockito';

import { FeatureToggleModule } from 'ish-core/feature-toggle.module';
import { makeHttpError } from 'ish-core/utils/dev/api-service-utils';

import { AhuService } from '../../services/ahu/ahu.service';

import { loadAhuManufacturers, loadAhuManufacturersFail, loadAhuManufacturersSuccess } from './manufacturer.actions';
import { ManufacturerEffects } from './manufacturer.effects';
import { manufacturers } from './manufacturer.mock';

describe('Manufacturer Effects', () => {
  let actions$;
  let ahuService: AhuService;
  let effects: ManufacturerEffects;

  beforeEach(() => {
    ahuService = mock(AhuService);

    TestBed.configureTestingModule({
      imports: [FeatureToggleModule.forTesting('camAhu')],
      providers: [
        ManufacturerEffects,
        provideMockActions(() => actions$),
        provideMockStore(),
        { provide: AhuService, useFactory: () => instance(ahuService) },
      ],
    });

    effects = TestBed.inject(ManufacturerEffects);
  });

  describe('loadManufacturers$', () => {
    beforeEach(() => {
      when(ahuService.getManufacturers()).thenReturn(of(manufacturers));
    });

    it('should call the AhuService for loadManufacturers', done => {
      const action = loadAhuManufacturers();
      actions$ = of(action);

      effects.loadAhuManufacturers$.subscribe(() => {
        verify(ahuService.getManufacturers()).once();
        done();
      });
    });

    it('should map to actions of type LoadAhuManufacturersSuccess', () => {
      const action = loadAhuManufacturers();
      const completion = loadAhuManufacturersSuccess({
        manufacturers,
      });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadAhuManufacturers$).toBeObservable(expected$);
    });

    it('should map failed calls to actions of type LoadAhuManufacturersFail', () => {
      const error = makeHttpError({ message: 'invalid' });
      when(ahuService.getManufacturers()).thenReturn(throwError(error));
      const action = loadAhuManufacturers();
      const completion = loadAhuManufacturersFail({
        error,
      });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadAhuManufacturers$).toBeObservable(expected$);
    });
  });
});
