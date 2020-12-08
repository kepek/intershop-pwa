import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { filter, map, switchMap } from 'rxjs/operators';

import { ofUrl, selectQueryParams } from 'ish-core/store/core/router';
import { mapErrorToAction, mapToPayloadProperty } from 'ish-core/utils/operators';

import { AhuService } from '../../services/ahu/ahu.service';

import {
  loadAhuManufacturer,
  loadAhuManufacturerFail,
  loadAhuManufacturerSuccess,
  loadAhuManufacturers,
  loadAhuManufacturersFail,
  loadAhuManufacturersSuccess,
  selectAhuManufacturer,
} from './manufacturer.actions';

@Injectable()
export class ManufacturerEffects {
  constructor(private actions$: Actions, private store: Store, private ahuService: AhuService) {}

  loadAhuManufacturers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadAhuManufacturers),
      switchMap(() =>
        this.ahuService.getManufacturers().pipe(
          map(manufacturers => loadAhuManufacturersSuccess({ manufacturers })),
          mapErrorToAction(loadAhuManufacturersFail)
        )
      )
    )
  );

  loadAhuManufacturer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadAhuManufacturer),
      mapToPayloadProperty('manufacturerId'),
      switchMap(manufacturerId =>
        this.ahuService.getManufacturer(manufacturerId).pipe(
          map(manufacturer => loadAhuManufacturerSuccess({ manufacturer })),
          mapErrorToAction(loadAhuManufacturerFail)
        )
      )
    )
  );

  determineSelectedManufacturerId$ = createEffect(() =>
    this.store.pipe(
      ofUrl(/^\/(demo|air-handling-unit-guide)/),
      select(selectQueryParams),
      filter(({ manufacturerId }) => !!manufacturerId),
      map(({ manufacturerId }) => selectAhuManufacturer({ manufacturerId }))
    )
  );
}
