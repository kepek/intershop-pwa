import { createFeatureSelector } from '@ngrx/store';

import { ManufacturerState } from './manufacturer/manufacturer.reducer';
import { UnitState } from './unit/unit.reducer';

export interface CamAhuState {
  manufacturers: ManufacturerState;
  units: UnitState;
}

export const getCamAhuState = createFeatureSelector<CamAhuState>('camAhu');
