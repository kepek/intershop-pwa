import { createSelector } from '@ngrx/store';

import { Unit } from '../../models/unit/unit.model';
import { getCamAhuState } from '../cam-ahu-store';

import { initialState, unitAdapter } from './unit.reducer';

const getUnitState = createSelector(getCamAhuState, state => (state ? state.units : initialState));

export const getAhuUnitsLoading = createSelector(getUnitState, state => state.loading);

export const getAhuUnitsError = createSelector(getUnitState, state => state.error);

const { selectAll, selectEntities, selectTotal } = unitAdapter.getSelectors(getUnitState);

export const getAllAhuUnits = selectAll;

export const getAhuUnitsCount = selectTotal;

export const getSelectedAhuUnitId = createSelector(getUnitState, state => state.selected);

export const getSelectedAhuUnitDetails = createSelector(
  selectEntities,
  getSelectedAhuUnitId,
  (entities, id): Unit => id && entities[id]
);

export const getAhuUnitDetails = createSelector(
  selectEntities,
  (entities, props: { id: string }): Unit => props.id && entities[props.id]
);
