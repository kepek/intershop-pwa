import { TestBed } from '@angular/core/testing';

import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { makeHttpError } from 'ish-core/utils/dev/api-service-utils';
import { StoreWithSnapshots, provideStoreSnapshots } from 'ish-core/utils/dev/ngrx-testing';

import { Unit } from '../../models/unit/unit.model';
import { CamAhuStoreModule } from '../cam-ahu-store.module';

import { loadAhuUnits, loadAhuUnitsFail, loadAhuUnitsSuccess } from './unit.actions';
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
      const loadUnitSuccessAction = loadAhuUnitsSuccess({ units: [unit] });

      beforeEach(() => {
        store$.dispatch(loadUnitSuccessAction);
      });

      it('should set loading to false', () => {
        expect(getAhuUnitsLoading(store$.state)).toBeFalse();
      });

      // TODO (extMlk): Fix this;
      xit('should add ahu unit to state', () => {
        expect(getAllAhuUnits(store$.state)).toEqual(unit);
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
