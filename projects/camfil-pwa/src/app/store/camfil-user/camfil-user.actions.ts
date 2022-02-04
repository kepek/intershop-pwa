import { createAction } from '@ngrx/store';
import { CamfilApplicantReminder } from 'camfil-pwa/models/camfil-applicant-reminder/camfil-applicant-reminder.model';
import { CamfilApplicantData } from 'camfil-pwa/models/camfil-applicant/camfil-applicant.interface';
import { CamfilApplicant } from 'camfil-pwa/models/camfil-applicant/camfil-applicant.model';
import { CamfilLangSubject } from 'camfil-pwa/models/camfil-lang/camfil-lang.model';

import { httpError, payload } from 'ish-core/utils/ngrx-creators';

export const resetUsernameReminder = createAction('[Camfil User] Reset Username Reminder Data');

export const requestApplicantReminder = createAction(
  '[Camfil User] Request Applicant Reminder',
  payload<{ data: CamfilApplicantReminder }>()
);

export const requestApplicantReminderSuccess = createAction('[Camfil User API]  Request Applicant Reminder Success');

export const requestApplicantReminderFail = createAction(
  '[Camfil User API] Request Applicant Reminder Fail',
  httpError()
);

export const loadCustomerUserPreferredLanguage = createAction(
  '[Camfil User] Load User Preferred Language',
  payload<Omit<CamfilLangSubject, 'lang'>>()
);

export const loadCustomerUserPreferredLanguageFail = createAction(
  '[Camfil User API] Load User Preferred Language Fail',
  httpError()
);

export const loadCustomerUserPreferredLanguageSuccess = createAction(
  '[Camfil User API] Load User Preferred Language Success',
  payload<Pick<CamfilLangSubject, 'lang'> & { successMessage?: string }>()
);

export const updateCustomerUserPreferredLanguage = createAction(
  '[Camfil User] Update User Preferred Language',
  payload<CamfilLangSubject>()
);

export const updateCustomerUserPreferredLanguageFail = createAction(
  '[Camfil User API] Update User Preferred Language Fail',
  httpError()
);

export const updateCustomerUserPreferredLanguageSuccess = createAction(
  '[Camfil User API] Update User Preferred Language Success',
  payload<Pick<CamfilLangSubject, 'lang'> & { successMessage?: string }>()
);

export const loadPreferredTitles = createAction('[Camfil Account ] Get Preferred Titles');

export const loadPreferredTitlesSuccess = createAction(
  '[Camfil Account  API] Get Preferred Titles Success',
  payload<{ preferredTitles: string[] }>()
);

export const loadPreferredTitlesFail = createAction('[Camfil Account  API] Get Preferred Titles Fail', httpError());

export const applyForAnAccount = createAction(
  '[Camfil Account  API] Apply For An Account',
  payload<{ applicant: CamfilApplicant }>()
);

export const applyForAnAccountSuccess = createAction(
  '[Camfil Account  API] Load Applicant Success',
  payload<{ applicant: CamfilApplicantData }>()
);

export const applyForAnAccountFail = createAction('[Camfil Account  API] Apply For An Account Failed', httpError());
