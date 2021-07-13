import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { map, take } from 'rxjs/operators';

import { setGTMToken } from 'ish-core/store/core/configuration';
import { mapToPayloadProperty, whenTruthy } from 'ish-core/utils/operators';

@Injectable()
export class TrackingEffects {
  constructor(private actions$: Actions) {}

  setGTMToken$ = createEffect(() =>
    this.actions$.pipe(
      ofType(setGTMToken),
      mapToPayloadProperty('gtmToken'),
      whenTruthy(),
      take(1),
      map(gtmToken => setGTMToken({ gtmToken }))
    )
  );
}
