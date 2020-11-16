import { createAction } from '@ngrx/store';

import { httpError, payload } from 'ish-core/utils/ngrx-creators';

import { Manufacturer } from '../../models/manufacturer/manufacturer.model';

export const loadAhuManufacturers = createAction('[AHU Manufacturers Internal] Load AHU Manufacturers');

export const loadAhuManufacturersSuccess = createAction(
  '[AHU Manufacturers API] Load AHU Manufacturers Success',
  payload<{ manufacturers: Manufacturer[] }>()
);

export const loadAhuManufacturersFail = createAction(
  '[AHU Manufacturers API] Load AHU Manufacturers Fail',
  httpError()
);

export const selectAhuManufacturer = createAction(
  '[AHU Manufacturers Internal] Select Manufacturer',
  payload<{ manufacturerId: string }>()
);

export const loadAhuManufacturer = createAction(
  '[AHU Manufacturers Internal] Load AHU Manufacturer',
  payload<{ manufacturerId: string }>()
);

export const loadAhuManufacturerSuccess = createAction(
  '[AHU Manufacturers API] Load AHU Manufacturer Success',
  payload<{ manufacturer: Manufacturer }>()
);

export const loadAhuManufacturerFail = createAction('[AHU Manufacturers API] Load AHU Manufacturer Fail', httpError());
