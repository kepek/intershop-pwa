import { createSelector } from '@ngrx/store';

import { Manufacturer } from '../../models/manufacturer/manufacturer.model';
import { getCamAhuState } from '../cam-ahu-store';

import { initialState, manufacturerAdapter } from './manufacturer.reducer';

const getManufacturerState = createSelector(getCamAhuState, state => (state ? state.manufacturers : initialState));

export const { selectEntities: getAhuManufacturerEntities } = manufacturerAdapter.getSelectors(getManufacturerState);

const { selectEntities, selectAll } = manufacturerAdapter.getSelectors(getManufacturerState);

export const getAllAhuManufacturers = selectAll;

export const getAhuManufacturerLoading = createSelector(getManufacturerState, state => state.loading);

export const getAhuManufacturerError = createSelector(getManufacturerState, state => state.error);

export const getSelectedAhuManufacturerId = createSelector(getManufacturerState, state => state.selected);

export const getSelectedAhuManufacturerDetails = createSelector(
  selectEntities,
  getSelectedAhuManufacturerId,
  (entities, id): Manufacturer => id && entities[id]
);

export const getAhuManufacturerDetails = createSelector(
  selectEntities,
  (entities, props: { id: string }): Manufacturer => props.id && entities[props.id]
);
