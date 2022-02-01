import { isPlatformServer } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { TransferState } from '@angular/platform-browser';
import { Actions, OnInitEffects, ROOT_EFFECTS_INIT, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { iif } from 'rxjs';
import { map, take, takeWhile, withLatestFrom } from 'rxjs/operators';

import { NGRX_STATE_SK } from 'ish-core/configurations/ngrx-state-transfer';
import { whenTruthy } from 'ish-core/utils/operators';
import { StatePropertiesService } from 'ish-core/utils/state-transfer/state-properties.service';

import { applyIccConfiguration, initIcc, setIccToken } from './icc.actions';

@Injectable()
export class IccEffects implements OnInitEffects {
  constructor(
    private actions$: Actions,
    private stateProperties: StatePropertiesService,
    private transferState: TransferState,
    @Inject(PLATFORM_ID) private platformId: string
  ) {}

  initIcc$ = createEffect(() =>
    iif(
      () => !this.transferState.hasKey(NGRX_STATE_SK),
      this.actions$.pipe(
        takeWhile(() => isPlatformServer(this.platformId)),
        ofType(initIcc),
        take(1),
        withLatestFrom(
          this.stateProperties.getStateOrEnvOrDefault<string>('ICC_PROXY_URL', 'iccProxyURL'),
          this.stateProperties.getStateOrEnvOrDefault<string>('ICC_SERVER', 'iccServer'),
          this.stateProperties.getStateOrEnvOrDefault<string>('ICC_TOKEN', 'iccToken'),
          this.stateProperties.getStateOrEnvOrDefault<string>('ICC_TOKEN_HEADER_KEY', 'iccTokenHeaderKey')
        ),
        // tslint:disable-next-line:no-unused
        map(([_, iccProxyURL, iccServer, iccToken, iccTokenHeaderKey]) =>
          applyIccConfiguration({
            iccProxyURL,
            iccServer,
            iccToken,
            iccTokenHeaderKey,
          })
        )
      )
    )
  );

  setIccToken$ = createEffect(() =>
    this.actions$.pipe(
      takeWhile(() => isPlatformServer(this.platformId)),
      ofType(ROOT_EFFECTS_INIT),
      take(1),
      withLatestFrom(this.stateProperties.getStateOrEnvOrDefault<string>('ICC_TOKEN', 'iccToken')),
      map(([, iccToken]) => iccToken),
      whenTruthy(),
      map(iccToken => setIccToken({ iccToken }))
    )
  );

  ngrxOnInitEffects(): Action {
    return initIcc();
  }
}
