import { createAction } from '@ngrx/store';

import { httpError, payload } from 'ish-core/utils/ngrx-creators';

import { UsernameReminder } from '../../models/username-reminder/username-reminder.model';
import { ChangeLanguagePayload } from '../../pages/account-profile/camfil-account-language-form/camfil-account-language-form.component';

export const resetUsernameReminder = createAction('[Username Reminder Internal] Reset Username Reminder Data');

export const requestUsernameReminder = createAction(
  '[Username Reminder] Request Password Reminder',
  payload<{ data: UsernameReminder }>()
);

export const requestUsernameReminderSuccess = createAction('[Username Reminder API] Request Username Reminder Success');

export const requestUsernameReminderFail = createAction(
  '[Username Reminder API] Request Username Reminder Fail',
  httpError()
);

export const loadCustomerUserPreferredLanguage = createAction(
  '[Customer User] Load User Preferred Language',
  payload<Omit<ChangeLanguagePayload, 'languageCode'>>()
);

export const loadCustomerUserPreferredLanguageFail = createAction(
  '[Customer User API] Load User Preferred Language Fail',
  httpError()
);

export const loadCustomerUserPreferredLanguageSuccess = createAction(
  '[Customer User API] Load User Preferred Language Success',
  payload<ChangeLanguagePayload>()
);

export const updateCustomerUserPreferredLanguage = createAction(
  '[Customer User] Update User Preferred Language',
  payload<ChangeLanguagePayload>()
);

export const updateCustomerUserPreferredLanguageFail = createAction(
  '[Customer User API] Update User Preferred Language Fail',
  httpError()
);

export const updateCustomerUserPreferredLanguageSuccess = createAction(
  '[Customer User API] Update User Preferred Language Success',
  payload<ChangeLanguagePayload>()
);
