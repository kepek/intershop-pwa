import { Injectable } from '@angular/core';
import { Actions, OnInitEffects, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { map, tap, withLatestFrom } from 'rxjs/operators';

import { StatePropertiesService } from 'ish-core/utils/state-transfer/state-properties.service';

import { applyIccConfiguration, initIcc } from './camfil-icc.actions';

@Injectable()
export class CamfilIccEffects implements OnInitEffects {
  constructor(private actions$: Actions, private stateProperties: StatePropertiesService) {}

  initIcc$ = createEffect(() =>
    this.actions$.pipe(
      ofType(initIcc),
      tap(x => console.log('x', x)),
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
  );

  ngrxOnInitEffects(): Action {
    return initIcc();
  }
}
