import { Injectable } from '@angular/core';
import { Actions, OnInitEffects, createEffect, ofType } from '@ngrx/effects';
import { Action, Store, select } from '@ngrx/store';
import { concatMap, map, mapTo, switchMapTo } from 'rxjs/operators';

import { mapErrorToAction, whenFalsy } from 'ish-core/utils/operators';

import { ConfigurationService } from '../../services/configuration/configuration.service';

import {
  initCamfilConfiguration,
  loadCamfilConfiguration,
  loadCamfilConfigurationFail,
  loadCamfilConfigurationSuccess,
} from './configuration.actions';
import { isCamfilConfigurationInitialized } from './configuration.selectors';

@Injectable()
export class ConfigurationEffects implements OnInitEffects {
  loadCamfilConfigurationOnInit$ = createEffect(() =>
    this.actions$.pipe(
      ofType(initCamfilConfiguration),
      switchMapTo(this.store.pipe(select(isCamfilConfigurationInitialized))),
      whenFalsy(),
      mapTo(loadCamfilConfiguration())
    )
  );

  loadCamfilConfiguration$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadCamfilConfiguration),
      concatMap(() =>
        this.configService.getCamfilConfiguration().pipe(
          map(configuration => loadCamfilConfigurationSuccess({ configuration })),
          mapErrorToAction(loadCamfilConfigurationFail)
        )
      )
    )
  );

  constructor(private actions$: Actions, private store: Store, private configService: ConfigurationService) {}

  ngrxOnInitEffects(): Action {
    return initCamfilConfiguration();
  }
}
