import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { Applicant } from '../models/applicant/applicant.model';
import { UsernameReminder } from '../models/username-reminder/username-reminder.model';
import { applyForAnAccount, getApplicant, getApplicantError, getApplicantLoading } from '../store/applicant';
import { getCamAccountState } from '../store/cam-account-store';
import {
  getError,
  getLoading,
  getUsernameReminderError,
  getUsernameReminderSuccess,
  requestUsernameReminder,
  resetUsernameReminder,
} from '../store/user';

// tslint:disable:member-ordering
@Injectable({ providedIn: 'root' })
export class CamAccountFacade {
  constructor(private store: Store) {}

  camAccountState$ = this.store.pipe(select(getCamAccountState));

  applicant$ = this.store.pipe(select(getApplicant));
  applicantError$ = this.store.pipe(select(getApplicantError));
  applicantLoading$ = this.store.pipe(select(getApplicantLoading));

  applyForAnAccount(applicant: Applicant) {
    this.store.dispatch(applyForAnAccount({ applicant }));
  }

  loading$ = this.store.pipe(select(getLoading));
  error$ = this.store.pipe(select(getError));

  // USERNAME

  usernameReminderSuccess$ = this.store.pipe(select(getUsernameReminderSuccess));
  usernameReminderError$ = this.store.pipe(select(getUsernameReminderError));

  resetUsernameReminder() {
    this.store.dispatch(resetUsernameReminder());
  }

  requestUsernameReminder(data: UsernameReminder) {
    this.store.dispatch(requestUsernameReminder({ data }));
  }
}
