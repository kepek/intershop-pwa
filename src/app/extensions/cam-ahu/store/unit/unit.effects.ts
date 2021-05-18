import { Injectable } from '@angular/core';
import { Params, Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { filter, map, switchMap, tap, withLatestFrom } from 'rxjs/operators';

import { ProductCompletenessLevel } from 'ish-core/models/product/product.helper';
import { ofUrl, selectQueryParams } from 'ish-core/store/core/router';
import { loadProductIfNotLoaded } from 'ish-core/store/shopping/products';
import { mapErrorToAction, mapToPayload, mapToPayloadProperty, whenTruthy } from 'ish-core/utils/operators';

import { UnitHelper } from '../../models/unit/unit.helper';
import { UnitAHUAirSlotItem } from '../../models/unit/unit.model';
import { AhuService } from '../../services/ahu/ahu.service';
import { getSelectedAhuManufacturerId } from '../manufacturer';

import {
  addAhuSlotItemToList,
  loadAhuUnit,
  loadAhuUnitFail,
  loadAhuUnitSuccess,
  loadAhuUnits,
  loadAhuUnitsFail,
  loadAhuUnitsSuccess,
  removeAhuSlotItemFromList,
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

  loadProductsForSelectedAhuUnit$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadAhuUnitSuccess),
      mapToPayloadProperty('unit'),
      switchMap(unit => {
        const lineItems: UnitAHUAirSlotItem[] = [].concat(...unit?.ahuAirSlots.map(ahuSlot => ahuSlot?.items));
        return [...lineItems.map(({ sku }) => loadProductIfNotLoaded({ sku, level: ProductCompletenessLevel.List }))];
      })
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
        ofType(addAhuSlotItemToList),
        mapToPayload(),
        withLatestFrom(this.store.pipe(select(selectQueryParams))),
        tap(([slotItem, queryParams]) => {
          this.navigateTo(undefined, UnitHelper.addAhuSlotItemToList(queryParams, slotItem));
        })
      ),
    { dispatch: false }
  );

  removeFromList$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(removeAhuSlotItemFromList),
        mapToPayload(),
        withLatestFrom(this.store.pipe(select(selectQueryParams))),
        tap(([slotItem, queryParams]) => {
          this.navigateTo(undefined, UnitHelper.removeAhuSlotItemFromList(queryParams, slotItem));
        })
      ),
    { dispatch: false }
  );

  private navigateTo(path: string, queryParams?: Params): void {
    let currentRoute = this.router.routerState.root;

    while (currentRoute.firstChild) {
      currentRoute = currentRoute.firstChild;
    }

    this.router.navigate(path ? [path] : [], {
      relativeTo: currentRoute,
      queryParams,
      queryParamsHandling: 'merge',
    });
  }
}
