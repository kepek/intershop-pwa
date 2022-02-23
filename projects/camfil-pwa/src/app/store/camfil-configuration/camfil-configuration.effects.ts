import { isPlatformServer } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { routerNavigationAction } from '@ngrx/router-store';
import { Store, select } from '@ngrx/store';
import { CamfilConfigurationService } from 'camfil-pwa/services/camfil-configuration/camfil-configuration.service';
import { identity } from 'rxjs';
import { concatMap, first, map, mapTo, switchMapTo } from 'rxjs/operators';

import { mapErrorToAction, whenFalsy } from 'ish-core/utils/operators';

import {
  loadCamfilConfiguration,
  loadCamfilConfigurationFail,
  loadCamfilConfigurationSuccess,
} from './camfil-configuration.actions';
import { isCamfilConfigurationInitialized } from './camfil-configuration.selectors';

@Injectable()
export class CamfilConfigurationEffects {
  loadCamfilConfigurationOnInit$ = createEffect(() =>
    this.actions$.pipe(
      ofType(routerNavigationAction),
      isPlatformServer(this.platformId) ? first() : identity,
      switchMapTo(this.store.pipe(select(isCamfilConfigurationInitialized))),
      whenFalsy(),
      mapTo(loadCamfilConfiguration())
    )
  );

  loadCamfilConfiguration$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadCamfilConfiguration),
      concatMap(() =>
        this.camfilConfigurationService.getCamfilConfiguration().pipe(
          map(configuration => loadCamfilConfigurationSuccess({ configuration })),
          mapErrorToAction(loadCamfilConfigurationFail)
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private store: Store,
    private camfilConfigurationService: CamfilConfigurationService,
    @Inject(PLATFORM_ID) private platformId: string
  ) {}
}
