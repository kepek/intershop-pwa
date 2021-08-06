import { createAction } from '@ngrx/store';

import { httpError, payload } from 'ish-core/utils/ngrx-creators';

import { ApplicantData } from '../../models/applicant/applicant.interface';
import { Applicant } from '../../models/applicant/applicant.model';

/* Preferred Titles */

export const loadPreferredTitles = createAction('[Applicant] Get Preferred Titles');

export const loadPreferredTitlesSuccess = createAction(
  '[Applicant API] Get Preferred Titles Success',
  payload<{ preferredTitles: string[] }>()
);

export const loadPreferredTitlesFail = createAction('[Applicant API] Get Preferred Titles Fail', httpError());

/* Apply */

export const applyForAnAccount = createAction(
  '[Applicant API] Apply For An Account',
  payload<{ applicant: Applicant }>()
);

export const applyForAnAccountSuccess = createAction(
  '[Applicant API] Load Applicant Success',
  payload<{ applicant: ApplicantData }>()
);

export const applyForAnAccountFail = createAction('[Applicant API] Apply For An Account Failed', httpError());
