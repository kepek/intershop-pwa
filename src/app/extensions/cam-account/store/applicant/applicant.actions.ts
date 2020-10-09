import { createAction } from '@ngrx/store';

import { httpError, payload } from 'ish-core/utils/ngrx-creators';

import { ApplicantData } from '../../models/applicant/applicant.interface';
import { Applicant } from '../../models/applicant/applicant.model';

export const applyForAnAccount = createAction(
  '[Applicant API] Apply For An Account',
  payload<{ applicant: Applicant }>()
);

export const applyForAnAccountSuccess = createAction(
  '[Applicant API] Load Applicant Success',
  payload<{ applicant: ApplicantData }>()
);

export const applyForAnAccountFail = createAction('[Applicant API] Apply For An Account Failed', httpError());
