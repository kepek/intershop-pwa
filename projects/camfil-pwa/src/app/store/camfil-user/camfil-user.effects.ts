import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { CamfilUserService } from 'camfil-pwa/services/camfil-user/camfil-user.service';
import { concatMap, filter, map, mergeMap } from 'rxjs/operators';

import { setCurrentLocale } from 'ish-core/store/core/configuration';
import { displayErrorMessage, displaySuccessMessage } from 'ish-core/store/core/messages';
import { mapErrorToAction, mapToPayload, mapToPayloadProperty, whenTruthy } from 'ish-core/utils/operators';

import {
  applyForAnAccount,
  applyForAnAccountFail,
  applyForAnAccountSuccess,
  loadCustomerUserPreferredLanguage,
  loadCustomerUserPreferredLanguageFail,
  loadCustomerUserPreferredLanguageSuccess,
  loadPreferredTitles,
  loadPreferredTitlesFail,
  loadPreferredTitlesSuccess,
  requestApplicantReminder,
  requestApplicantReminderFail,
  requestApplicantReminderSuccess,
  updateCustomerUserPreferredLanguage,
  updateCustomerUserPreferredLanguageFail,
  updateCustomerUserPreferredLanguageSuccess,
} from './camfil-user.actions';

@Injectable()
export class CamfilUserEffects {
  constructor(private actions$: Actions, private userService: CamfilUserService) {}

  requestApplicantReminder$ = createEffect(() =>
    this.actions$.pipe(
      ofType(requestApplicantReminder),
      mapToPayloadProperty('data'),
      concatMap(data =>
        this.userService
          .requestApplicantReminder(data)
          .pipe(map(requestApplicantReminderSuccess), mapErrorToAction(requestApplicantReminderFail))
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

  loadPreferredTitles$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadPreferredTitles),
      mergeMap(() =>
        this.userService.loadPreferredTitles().pipe(
          map(preferredTitles => loadPreferredTitlesSuccess({ preferredTitles })),
          mapErrorToAction(loadPreferredTitlesFail)
        )
      )
    )
  );

  applyForAnAccount$ = createEffect(() =>
    this.actions$.pipe(
      ofType(applyForAnAccount),
      mapToPayloadProperty('applicant'),
      concatMap(newApplicant =>
        this.userService.applyForAnAccount(newApplicant).pipe(
          mergeMap(applicant => [
            applyForAnAccountSuccess({ applicant }),
            displaySuccessMessage({
              message: 'camfil.register.form.valid.text',
            }),
          ]),
          mapErrorToAction(applyForAnAccountFail)
        )
      )
    )
  );
}
