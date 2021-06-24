import { createAction } from '@ngrx/store';

import { httpError, payload } from 'ish-core/utils/ngrx-creators';

import { LangSubject } from '../../models/lang/lang.model';
import { UsernameReminder } from '../../models/username-reminder/username-reminder.model';

export const resetUsernameReminder = createAction('[Camfil Account] Reset Username Reminder Data');

export const requestUsernameReminder = createAction(
  '[Camfil Account] Request Username Reminder',
  payload<{ data: UsernameReminder }>()
);

export const requestUsernameReminderSuccess = createAction('[Camfil Account API]  Request Username Reminder Success');

export const requestUsernameReminderFail = createAction(
  '[Camfil Account API] Request Username Reminder Fail',
  httpError()
);

export const loadCustomerUserPreferredLanguage = createAction(
  '[Camfil Account] Load User Preferred Language',
  payload<Omit<LangSubject, 'lang'>>()
);

export const loadCustomerUserPreferredLanguageFail = createAction(
  '[Camfil Account API] Load User Preferred Language Fail',
  httpError()
);

export const loadCustomerUserPreferredLanguageSuccess = createAction(
  '[Camfil Account API] Load User Preferred Language Success',
  payload<Pick<LangSubject, 'lang'> & { successMessage?: string }>()
);

export const updateCustomerUserPreferredLanguage = createAction(
  '[Camfil Account] Update User Preferred Language',
  payload<LangSubject>()
);

export const updateCustomerUserPreferredLanguageFail = createAction(
  '[Camfil Account API] Update User Preferred Language Fail',
  httpError()
);

export const updateCustomerUserPreferredLanguageSuccess = createAction(
  '[Camfil Account API] Update User Preferred Language Success',
  payload<Pick<LangSubject, 'lang'> & { successMessage?: string }>()
);
