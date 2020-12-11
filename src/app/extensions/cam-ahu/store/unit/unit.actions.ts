import { createAction } from '@ngrx/store';

import { httpError, payload } from 'ish-core/utils/ngrx-creators';

import { Unit } from '../../models/unit/unit.model';

export const loadAhuUnits = createAction('[AHU Unit Internal] Load AHU Units', payload<{ manufacturerId: string }>());

export const loadAhuUnitsSuccess = createAction('[AHU Unit API] Load AHU Units Success', payload<{ units: Unit[] }>());

export const loadAhuUnitsFail = createAction('[AHU Unit API] Load AHU Units Fail', httpError());

export const selectAhuUnit = createAction('[AHU Unit Internal] Select Unit', payload<{ unitId: string }>());

export const loadAhuUnit = createAction('[AHU Unit Internal] Load AHU Unit', payload<{ unitId: string }>());

export const loadAhuUnitSuccess = createAction('[AHU Unit API] Load AHU Unit Success', payload<{ unit: Unit }>());

export const loadAhuUnitFail = createAction('[AHU Unit API] Load AHU Unit Fail', httpError());
