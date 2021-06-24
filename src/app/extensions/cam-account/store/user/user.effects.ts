import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatMap, filter, map, mergeMap } from 'rxjs/operators';

import { setCurrentLocale } from 'ish-core/store/core/configuration';
import { displayErrorMessage, displaySuccessMessage } from 'ish-core/store/core/messages';
import { mapErrorToAction, mapToPayload, mapToPayloadProperty, whenTruthy } from 'ish-core/utils/operators';

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
      concatMap(subject =>
        this.userService
          .getCustomerUserPreferredLanguage(subject)
          .pipe(map(loadCustomerUserPreferredLanguageSuccess), mapErrorToAction(loadCustomerUserPreferredLanguageFail))
      )
    )
  );

  updateCustomerUserPreferredLanguage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateCustomerUserPreferredLanguage),
      mapToPayload(),
      concatMap(subject =>
        this.userService.updateCustomerUserPreferredLanguage(subject).pipe(
          mergeMap(data => [
            // TODO (extMlk): Probably we should debounce locale change and display success message in previous language.
            setCurrentLocale(data),
            updateCustomerUserPreferredLanguageSuccess({
              ...data,
              successMessage: 'camfil.account.profile.change_language.message.success',
            }),
          ]),
          mapErrorToAction(updateCustomerUserPreferredLanguageFail)
        )
      )
    )
  );

  // Display Success Message for Updates

  displayUpdateCustomerUserSuccessMessage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateCustomerUserPreferredLanguageSuccess),
      mapToPayloadProperty('successMessage'),
      filter(successMessage => !!successMessage),
      map(successMessage =>
        displaySuccessMessage({
          message: successMessage,
        })
      )
    )
  );

  // Display Fail Message for Updates

  displayUpdateCustomerUserFailMessage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateCustomerUserPreferredLanguageFail),
      mapToPayloadProperty('error'),
      whenTruthy(),
      map(error =>
        displayErrorMessage({
          message: error?.message || error?.code,
        })
      )
    )
  );
}
