import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { setLoadingOn } from 'ish-core/utils/ngrx-creators';

import { Manufacturer } from '../../models/manufacturer/manufacturer.model';

import {
  loadAhuManufacturer,
  loadAhuManufacturerFail,
  loadAhuManufacturerSuccess,
  loadAhuManufacturers,
  loadAhuManufacturersFail,
  loadAhuManufacturersSuccess,
  selectAhuManufacturer,
} from './manufacturer.actions';

export interface ManufacturerState extends EntityState<Manufacturer> {
  loading: boolean;
  selected: string;
  error: HttpError;
  initialized: boolean;
}

export const manufacturerAdapter = createEntityAdapter<Manufacturer>({
  selectId: manufacturer => manufacturer.id,
});

export const initialState: ManufacturerState = manufacturerAdapter.getInitialState({
  loading: false,
  selected: undefined,
  error: undefined,
  initialized: false,
});

export const manufacturerReducer = createReducer(
  initialState,
  setLoadingOn(loadAhuManufacturer, loadAhuManufacturers),
  on(loadAhuManufacturersSuccess, state => ({ ...state, initialized: true })),
  on(loadAhuManufacturerFail, loadAhuManufacturersFail, (state: ManufacturerState, action) => {
    const { error } = action.payload;
    return {
      ...state,
      loading: false,
      error,
      selected: undefined,
    };
  }),
  on(loadAhuManufacturerSuccess, (state: ManufacturerState, action) => {
    const { manufacturer } = action.payload;
    return {
      ...manufacturerAdapter.upsertOne(manufacturer, state),
      selected: manufacturer.id,
      loading: false,
      error: undefined,
    };
  }),
  on(loadAhuManufacturersSuccess, (state: ManufacturerState, action) => {
    const { manufacturers } = action.payload;
    return {
      ...manufacturerAdapter.upsertMany(manufacturers, state),
      loading: false,
      error: undefined,
    };
  }),
  on(selectAhuManufacturer, (state: ManufacturerState, action) => {
    const { manufacturerId } = action.payload;
    return {
      ...state,
      selected: manufacturerId,
    };
  })
);
