import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { routerNavigationAction } from '@ngrx/router-store';
import { Store, select } from '@ngrx/store';
import { concatMap, map, mapTo, switchMapTo } from 'rxjs/operators';

import { mapErrorToAction, whenFalsy } from 'ish-core/utils/operators';

import { ConfigurationService } from '../../services/configuration/configuration.service';

import {
  loadCamfilConfiguration,
  loadCamfilConfigurationFail,
  loadCamfilConfigurationSuccess,
} from './configuration.actions';
import { isCamfilConfigurationLoaded } from './configuration.selectors';

@Injectable()
export class ConfigurationEffects {
  constructor(private actions$: Actions, private store: Store, private configService: ConfigurationService) {}

  /**
   * get camfil server configuration on routing event, if it is not already loaded
   */
  loadCamfilConfigurationOnInit$ = createEffect(() =>
    this.actions$.pipe(
      ofType(routerNavigationAction),
      switchMapTo(this.store.pipe(select(isCamfilConfigurationLoaded))),
      whenFalsy(),
      mapTo(loadCamfilConfiguration())
    )
  );

  loadCamfilConfiguration$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadCamfilConfiguration),
      concatMap(() =>
        this.configService.getCamfilServerConfiguration().pipe(
          map(configuration => loadCamfilConfigurationSuccess({ configuration })),
          mapErrorToAction(loadCamfilConfigurationFail)
        )
      )
    )
  );
}
