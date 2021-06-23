import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatMap, map } from 'rxjs/operators';

import { mapErrorToAction, mapToPayload, mapToPayloadProperty } from 'ish-core/utils/operators';

import { CamAccountService } from '../../services/cam-account/cam-account.service';

import {
  loadCustomerUserPreferredLanguage,
  loadCustomerUserPreferredLanguageFail,
  loadCustomerUserPreferredLanguageSuccess,
  requestUsernameReminder,
  requestUsernameReminderFail,
  requestUsernameReminderSuccess,
  updateCustomerUserPreferredLanguage,
  updateCustomerUserPreferredLanguageFail,
  updateCustomerUserPreferredLanguageSuccess,
} from './user.actions';

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

  loadCustomerUserPreferredLanguage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadCustomerUserPreferredLanguage),
      mapToPayload(),
      concatMap(payload =>
        this.userService
          .getCustomerUserPreferredLanguage(payload)
          .pipe(map(loadCustomerUserPreferredLanguageSuccess), mapErrorToAction(loadCustomerUserPreferredLanguageFail))
      )
    )
  );

  updateCustomerUserPreferredLanguage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateCustomerUserPreferredLanguage),
      mapToPayload(),
      concatMap(payload =>
        this.userService
          .updateCustomerUserPreferredLanguage(payload)
          .pipe(
            map(updateCustomerUserPreferredLanguageSuccess),
            mapErrorToAction(updateCustomerUserPreferredLanguageFail)
          )
      )
    )
  );
}
