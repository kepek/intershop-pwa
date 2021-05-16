import { Injectable } from '@angular/core';
import { Params, Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import * as qs from 'qs';
import { filter, map, switchMap, tap, withLatestFrom } from 'rxjs/operators';

import { ofUrl, selectQueryParams } from 'ish-core/store/core/router';
import { mapErrorToAction, mapToPayload, mapToPayloadProperty, whenTruthy } from 'ish-core/utils/operators';

import { AhuService } from '../../services/ahu/ahu.service';
import { getSelectedAhuManufacturerId } from '../manufacturer';

import {
  addToList,
  loadAhuUnit,
  loadAhuUnitFail,
  loadAhuUnitSuccess,
  loadAhuUnits,
  loadAhuUnitsFail,
  loadAhuUnitsSuccess,
  removeFromList,
  selectAhuUnit,
} from './unit.actions';
import { getSelectedAhuUnitId } from './unit.selectors';

@Injectable()
export class UnitEffects {
  constructor(
    private actions$: Actions,
    private ahuService: AhuService,
    private router: Router,
    private store: Store
  ) {}

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

  addToList$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(addToList),
        mapToPayload(),
        withLatestFrom(this.store.pipe(select(selectQueryParams))),
        tap(([{ manufacturerId, unitId, slotId, sku }, queryParams]) => {
          const prevSlots = this.parseQs(queryParams?.slots) as {};

          console.log('prevSlots', prevSlots);

          const nextSlots = {};
          nextSlots[slotId] = prevSlots[slotId] ? [...prevSlots[slotId], sku] : [sku];

          const slots = { ...prevSlots, ...nextSlots };

          this.navigateTo(undefined, { manufacturerId, unitId, slots: this.stringifyToQs(slots) });
        })
      ),
    { dispatch: false }
  );

  removeFromList$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(removeFromList),
        mapToPayload(),
        withLatestFrom(this.store.pipe(select(selectQueryParams))),
        tap(([{ manufacturerId, unitId, slotId, sku }, queryParams]) => {
          const prevSlots = { ...this.parseQs(queryParams?.slots) } as {};

          const nextSlots = {};
          nextSlots[slotId] = prevSlots[slotId] ? [...prevSlots[slotId]].filter(item => item !== sku) : [];

          const slots = { ...prevSlots, ...nextSlots };

          const newQueryParams = { manufacturerId, unitId, slots: this.stringifyToQs(slots) };

          this.navigateTo(undefined, newQueryParams);
        })
      ),
    { dispatch: false }
  );

  private navigateTo(path: string, queryParams?: Params): void {
    let currentRoute = this.router.routerState.root;

    while (currentRoute.firstChild) {
      currentRoute = currentRoute.firstChild;
    }

    console.log('queryParams', queryParams);

    this.router.navigate(path ? [path] : [], {
      relativeTo: currentRoute,
      queryParams,
      queryParamsHandling: 'merge',
    });
  }

  private stringifyToQs(obj: {}): string {
    return qs.stringify(obj, { encode: false });
  }

  private parseQs(str: string): qs.ParsedQs {
    return qs.parse(str);
  }
}
