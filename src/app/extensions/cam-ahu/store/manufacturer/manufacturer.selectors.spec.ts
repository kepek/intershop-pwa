import { TestBed } from '@angular/core/testing';

import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { makeHttpError } from 'ish-core/utils/dev/api-service-utils';
import { StoreWithSnapshots, provideStoreSnapshots } from 'ish-core/utils/dev/ngrx-testing';

import { Manufacturer } from '../../models/manufacturer/manufacturer.model';
import { CamAhuStoreModule } from '../cam-ahu-store.module';

import {
  loadAhuManufacturers,
  loadAhuManufacturersFail,
  loadAhuManufacturersSuccess,
  selectAhuManufacturer,
} from './manufacturer.actions';
import {
  getAhuManufacturerDetails,
  getAhuManufacturerError,
  getAhuManufacturerLoading,
  getAllAhuManufacturers,
  getSelectedAhuManufacturerDetails,
  getSelectedAhuManufacturerId,
} from './manufacturer.selectors';

describe('Manufacturer Selectors', () => {
  let store$: StoreWithSnapshots;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CamAhuStoreModule.forTesting('manufacturers'), CoreStoreModule.forTesting()],
      providers: [provideStoreSnapshots()],
    });

    store$ = TestBed.inject(StoreWithSnapshots);
  });

  const manufacturers: Manufacturer[] = [
    {
      name: 'Fläktwoods',
      id: '4711',
      market: ['SE', 'DK'],
      description: [
        {
          lang: 'EN-US',
          shortDescription: 'Flaektwoods',
        },
        {
          lang: 'SV-SE',
          shortDescription: 'Fläktwoods',
        },
        {
          lang: 'EN-US',
          longDescription:
            'Flaektwoods is the bla bla bla and something more as a mouse-over text or whatever you would like.',
        },
        {
          lang: 'SV-SE',
          longDescription:
            'Fläktwoods är den bla bla bla och något ytterligare som kan visas som en mouse-over/popup text eller vad man nu önskar.',
        },
      ],
      images: [
        {
          uri: 'https://camfil.com/some/CDN/uri/flaktwoods.png',
          type: 'logotype',
        },
      ],
    },
    {
      name: 'Fläktmetals',
      id: '4712',
      market: ['SE', 'FI'],
      description: [
        {
          lang: 'EN-US',
          shortDescription: 'Flaektmetals',
        },
        {
          lang: 'SV-SE',
          shortDescription: 'Fläktmetals',
        },
        {
          lang: 'EN-US',
          longDescription:
            'Flaektmetals is the bla bla bla and something more as a mouse-over text or whatever you would like.',
        },
        {
          lang: 'SV-SE',
          longDescription:
            'Fläktmetals är den bla bla bla och något ytterligare som kan visas som en mouse-over/popup text eller vad man nu önskar.',
        },
      ],
      images: [
        {
          uri: 'https://camfil.com/some/CDN/uri/flaktmetals.png',
          type: 'logotype',
        },
      ],
    },
  ];

  describe('initial state', () => {
    it('should not be loading when in initial state', () => {
      expect(getAhuManufacturerLoading(store$.state)).toBeFalse();
    });
    it('should not have a selected ahu manufacturers when in initial state', () => {
      expect(getSelectedAhuManufacturerId(store$.state)).toBeUndefined();
    });
    it('should not have an error when in initial state', () => {
      expect(getAhuManufacturerError(store$.state)).toBeUndefined();
    });
  });

  describe('loading ahu manufacturers', () => {
    describe('LoadManufacturers', () => {
      const loadManufacturerAction = loadAhuManufacturers();

      beforeEach(() => {
        store$.dispatch(loadManufacturerAction);
      });

      it('should set loading to true', () => {
        expect(getAhuManufacturerLoading(store$.state)).toBeTrue();
      });
    });

    describe('LoadManufacturersSuccess', () => {
      const loadManufacturerSuccessAction = loadAhuManufacturersSuccess({ manufacturers });

      beforeEach(() => {
        store$.dispatch(loadManufacturerSuccessAction);
      });

      it('should set loading to false', () => {
        expect(getAhuManufacturerLoading(store$.state)).toBeFalse();
      });

      it('should add ahu manufacturers to state', () => {
        expect(getAllAhuManufacturers(store$.state)).toEqual(manufacturers);
      });
    });

    describe('LoadManufacturersFail', () => {
      const loadManufacturersFailAction = loadAhuManufacturersFail({ error: makeHttpError({ message: 'invalid' }) });

      beforeEach(() => {
        store$.dispatch(loadManufacturersFailAction);
      });

      it('should set loading to false', () => {
        expect(getAhuManufacturerLoading(store$.state)).toBeFalse();
      });

      it('should add the error to state', () => {
        expect(getAhuManufacturerError(store$.state)).toMatchInlineSnapshot(`
          Object {
            "message": "invalid",
            "name": "HttpErrorResponse",
          }
        `);
      });
    });
  });

  describe('Get Selected AHU Manufacturers', () => {
    const loadManufacturersSuccessActions = loadAhuManufacturersSuccess({ manufacturers });
    const selectAhuManufacturerAction = selectAhuManufacturer({ manufacturerId: manufacturers[1].id });

    beforeEach(() => {
      store$.dispatch(loadManufacturersSuccessActions);
      store$.dispatch(selectAhuManufacturerAction);
    });

    it('should return correct ahu manufacturers id for given id', () => {
      expect(getSelectedAhuManufacturerId(store$.state)).toEqual(manufacturers[1].id);
    });

    it('should return correct ahu manufacturers details for given id', () => {
      expect(getSelectedAhuManufacturerDetails(store$.state)).toEqual(manufacturers[1]);
    });
  });

  describe('Get AHU Manufacturers Details', () => {
    const loadManufacturerSuccessActions = loadAhuManufacturersSuccess({ manufacturers });

    beforeEach(() => {
      store$.dispatch(loadManufacturerSuccessActions);
    });

    it('should return correct ahu manufacturers for given id', () => {
      expect(getAhuManufacturerDetails(store$.state, { id: manufacturers[1].id })).toEqual(manufacturers[1]);
    });
  });
});
