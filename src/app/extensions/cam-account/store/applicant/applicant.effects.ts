import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatMap, mergeMap } from 'rxjs/operators';

import { displaySuccessMessage } from 'ish-core/store/core/messages';
import { mapErrorToAction, mapToPayloadProperty } from 'ish-core/utils/operators';

import { CamAccountService } from '../../services/cam-account/cam-account.service';

import { applyForAnAccount, applyForAnAccountFail, applyForAnAccountSuccess } from './applicant.actions';

@Injectable()
export class ApplicantEffects {
  constructor(private actions$: Actions, private camAccountService: CamAccountService) {}

  applyForAnAccount$ = createEffect(() =>
    this.actions$.pipe(
      ofType(applyForAnAccount),
      mapToPayloadProperty('applicant'),
      concatMap(newApplicant =>
        this.camAccountService.applyForAnAccount(newApplicant).pipe(
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
