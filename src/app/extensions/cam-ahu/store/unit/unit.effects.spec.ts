import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { cold, hot } from 'jest-marbles';
import { of, throwError } from 'rxjs';
import { instance, mock, verify, when } from 'ts-mockito';

import { FeatureToggleModule } from 'ish-core/feature-toggle.module';
import { makeHttpError } from 'ish-core/utils/dev/api-service-utils';

import { Unit } from '../../models/unit/unit.model';
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

describe('Unit Effects', () => {
  let actions$;
  let ahuService: AhuService;
  let effects: UnitEffects;

  const unit: Unit = {
    id: '56564',
    ahu: {
      id: '56564',
      market: ['SE', 'DK'],
      airHandlingUnitName: [
        { lang: 'EN-US', text: 'eQ MASTER® 2000 X' },
        { lang: 'SV-SE', text: 'eQ MASTER® 2000 X' },
      ],
      ahuManufacturerName: 'Fläkt Woods',
      ahuManufacturerId: '4711',
      ahuShortDescription: [
        { lang: 'EN-US', text: 'A short english description' },
        { lang: 'SV-SE', text: 'En kort svensk beskrivning' },
      ],
      ahuLongDescription: [
        { lang: 'EN-US', text: 'A long english description' },
        { lang: 'SV-SE', text: 'En lång svensk beskrivning' },
      ],
      ahUimages: [
        { image: 'https://image.url/image1.png', type: 'FrontView' },
        { image: 'https://image.url/image2.png', type: 'IsoView' },
      ],
      ahUdocuments: [
        { document: 'https://document.url/document1.pdf', type: 'Manual' },
        { document: 'https://document.url/document2.pdf', type: 'Certificate' },
      ],
    },
    ahuAirSlots: [
      {
        ahuSlotType: 'Supply',
        ahuSlotOrder: 1,
        ahuSlotId: '11147',
        ahuSlotName: '1 x 460x460x540',
        ahuSlotAmount: '1',
        ahuSlotWidthMm: '460',
        ahuSlotLengthMm: '460',
        ahuSlotDepthMm: '540',
        items: [{ item: 'item1' }, { item: 'item2' }],
      },
      {
        ahuSlotType: 'Supply',
        ahuSlotOrder: 2,
        ahuSlotId: '11148',
        ahuSlotName: '2 x 200x200x320',
        ahuSlotAmount: '2',
        ahuSlotWidthMm: '200',
        ahuSlotLengthMm: '200',
        ahuSlotDepthMm: '320',
        items: [{ item: 'item1' }],
      },
      {
        ahuSlotType: 'Exhaust',
        ahuSlotOrder: 1,
        ahuSlotId: '11149',
        ahuSlotName: '2 x 640x640x880',
        ahuSlotAmount: '2',
        ahuSlotWidthMm: '640',
        ahuSlotLengthMm: '640',
        ahuSlotDepthMm: '880',
        items: [{ item: 'item1' }, { item: 'item2' }, { item: 'item3' }],
      },
    ],
  };

  beforeEach(() => {
    ahuService = mock(AhuService);

    TestBed.configureTestingModule({
      imports: [FeatureToggleModule.forTesting('camAhu')],
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
      when(ahuService.getUnits('56564')).thenReturn(of([unit]));
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
        units: [unit],
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
      when(ahuService.getUnit('123454')).thenReturn(of(unit));
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
        unit,
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
