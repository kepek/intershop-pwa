import { createAction } from '@ngrx/store';

import { httpError, payload } from 'ish-core/utils/ngrx-creators';

import { UsernameReminder } from '../../models/username-reminder/username-reminder.model';

export const resetUsernameReminder = createAction('[Userame Reminder Internal] Reset Username Reminder Data');

export const requestUsernameReminder = createAction(
  '[Userame Reminder] Request Password Reminder',
  payload<{ data: UsernameReminder }>()
);

export const requestUsernameReminderSuccess = createAction(
  '[Username Reminder API] Request Username Reminder Success',
  payload<{ accounts: string[] }>()
);

export const requestUsernameReminderFail = createAction(
  '[Username Reminder API] Request Username Reminder Fail',
  httpError()
);
