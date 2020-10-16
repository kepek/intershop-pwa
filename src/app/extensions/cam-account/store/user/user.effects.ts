import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatMap, map } from 'rxjs/operators';

import { mapErrorToAction, mapToPayloadProperty } from 'ish-core/utils/operators';

import { CamAccountService } from '../../services/cam-account/cam-account.service';

import { requestUsernameReminder, requestUsernameReminderFail, requestUsernameReminderSuccess } from './user.actions';

@Injectable()
export class UserEffects {
  constructor(private actions$: Actions, private userService: CamAccountService) {}
  requestUsernameReminder$ = createEffect(() =>
    this.actions$.pipe(
      ofType(requestUsernameReminder),
      mapToPayloadProperty('data'),
      concatMap(data =>
        this.userService
          .requestUsernameReminder(data)
          .pipe(map(requestUsernameReminderSuccess), mapErrorToAction(requestUsernameReminderFail))
      )
    )
  );
}
