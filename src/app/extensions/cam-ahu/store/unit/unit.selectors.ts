import { createSelector, createSelectorFactory, defaultMemoize } from '@ngrx/store';
import { isEqual } from 'lodash-es';

import { BreadcrumbItem } from 'ish-core/models/breadcrumb-item/breadcrumb-item.interface';

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

export const getSelectedAhuUnit = createSelector(
  selectEntities,
  getSelectedAhuUnitId,
  (entities, id): Unit => id && entities[id]
);

export const getAhuUnitDetails = createSelector(
  selectEntities,
  (entities, props: { id: string }): Unit => props.id && entities[props.id]
);

export const getBreadcrumbForSelectedAhuUnit = createSelectorFactory(projector =>
  defaultMemoize(projector, undefined, isEqual)
)(getSelectedAhuUnit, (unit: Unit) => {
  if (!unit) {
    return;
  }

  const ahuLink = '/air-handling-unit-guide';

  return [
    { key: 'camfil.ahu.link', link: ahuLink },
    { text: unit?.ahu?.ahuManufacturerName, link: ahuLink },
    { text: unit?.ahu?.airHandlingUnitName, link: ahuLink },
  ] as BreadcrumbItem[];
});
