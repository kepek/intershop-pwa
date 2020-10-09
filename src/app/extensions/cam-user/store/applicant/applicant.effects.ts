import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { concatMap, mergeMap } from 'rxjs/operators';

import { displaySuccessMessage } from 'ish-core/store/core/messages';
import { mapErrorToAction, mapToPayloadProperty } from 'ish-core/utils/operators';

import { UserService } from '../../services/user/user.service';

import { applyForAnAccount, applyForAnAccountFail, applyForAnAccountSuccess } from './applicant.actions';

@Injectable()
export class ApplicantEffects {
  constructor(private actions$: Actions, private userService: UserService) {}

  applyForAnAccount$ = createEffect(() =>
    this.actions$.pipe(
      ofType(applyForAnAccount),
      mapToPayloadProperty('applicant'),
      concatMap(newApplicant =>
        this.userService.applyForAnAccount(newApplicant).pipe(
          mergeMap(applicant => [
            applyForAnAccountSuccess({ applicant }),
            displaySuccessMessage({
              message: 'camfil.organization.user_management.new_applicant.confirmation',
              messageParams: { 0: `${applicant.firstName} ${applicant.lastName}` },
            }),
          ]),
          mapErrorToAction(applyForAnAccountFail)
        )
      )
    )
  );
}
