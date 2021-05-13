import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { filter, map, switchMap, withLatestFrom } from 'rxjs/operators';

import { ofUrl, selectQueryParams } from 'ish-core/store/core/router';
import { mapErrorToAction, mapToPayloadProperty, whenTruthy } from 'ish-core/utils/operators';

import { AhuService } from '../../services/ahu/ahu.service';
import { getSelectedAhuManufacturerId } from '../manufacturer';

import {
  loadAhuUnit,
  loadAhuUnitFail,
  loadAhuUnitSuccess,
  loadAhuUnits,
  loadAhuUnitsFail,
  loadAhuUnitsSuccess,
  selectAhuUnit,
} from './unit.actions';
import { getSelectedAhuUnitId } from './unit.selectors';

@Injectable()
export class UnitEffects {
  constructor(private actions$: Actions, private store: Store, private ahuService: AhuService) {}

  loadAhuUnits$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadAhuUnits),
      mapToPayloadProperty('manufacturerId'),
      whenTruthy(),
      switchMap(manufacturerId =>
        this.ahuService.getUnits(manufacturerId).pipe(
          map(units => loadAhuUnitsSuccess({ units })),
          mapErrorToAction(loadAhuUnitsFail)
        )
      )
    )
  );

  loadAhuUnit$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadAhuUnit),
      mapToPayloadProperty('unitId'),
      whenTruthy(),
      switchMap(unitId =>
        this.ahuService.getUnit(unitId).pipe(
          map(unit => loadAhuUnitSuccess({ unit })),
          mapErrorToAction(loadAhuUnitFail)
        )
      )
    )
  );

  selectAhuUnit$ = createEffect(() =>
    this.actions$.pipe(
      ofType(selectAhuUnit),
      mapToPayloadProperty('unitId'),
      withLatestFrom(this.store.pipe(select(getSelectedAhuManufacturerId))),
      filter(([unitId, selectedAhuManufacturerId]) => unitId !== selectedAhuManufacturerId),
      map(([unitId]) => loadAhuUnit({ unitId }))
    )
  );

  determineSelectedUnitId$ = createEffect(() =>
    this.store.pipe(
      ofUrl(/^\/(demo|air-handling-unit-guide)/),
      select(selectQueryParams),
      filter(params => !!params?.unitId),
      withLatestFrom(this.store.pipe(select(getSelectedAhuUnitId))),
      filter(([params, selectedAhuUnitId]) => params?.unitId !== selectedAhuUnitId),
      map(([params]) => selectAhuUnit({ unitId: params?.unitId }))
    )
  );
}
