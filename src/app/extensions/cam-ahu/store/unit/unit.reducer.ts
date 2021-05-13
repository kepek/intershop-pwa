import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { setLoadingOn } from 'ish-core/utils/ngrx-creators';

import { Unit } from '../../models/unit/unit.model';
import { selectAhuManufacturer } from '../manufacturer';

import {
  loadAhuUnit,
  loadAhuUnitFail,
  loadAhuUnitSuccess,
  loadAhuUnits,
  loadAhuUnitsFail,
  loadAhuUnitsSuccess,
  selectAhuUnit,
} from './unit.actions';

export interface UnitState extends EntityState<Unit> {
  loading: boolean;
  selected: string;
  error: HttpError;
}

export const unitAdapter = createEntityAdapter<Unit>({
  selectId: ahu => ahu.ahu.id,
});

export const initialState: UnitState = unitAdapter.getInitialState({
  loading: false,
  selected: undefined,
  error: undefined,
});

export const unitReducer = createReducer(
  initialState,
  setLoadingOn(loadAhuUnit, loadAhuUnits),
  on(loadAhuUnitFail, loadAhuUnitsFail, (state: UnitState, action) => {
    const { error } = action.payload;
    return {
      ...state,
      loading: false,
      error,
      selected: undefined,
    };
  }),
  on(loadAhuUnitSuccess, (state: UnitState, action) => {
    const { unit } = action.payload;
    return {
      ...unitAdapter.upsertOne(unit, state),
      selected: unit.ahu.id,
      loading: false,
      error: undefined,
    };
  }),
  on(loadAhuUnitsSuccess, (state: UnitState, action) => {
    const { units } = action.payload;
    return {
      ...unitAdapter.upsertMany(units, state),
      loading: false,
      error: undefined,
    };
  }),
  on(selectAhuUnit, (state: UnitState, action) => {
    const { unitId } = action.payload;
    return {
      ...state,
      selected: unitId,
    };
  }),
  on(selectAhuManufacturer, (state: UnitState) => ({
    ...state,
    selected: undefined,
  }))
);
