import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { Applicant } from '../models/applicant/applicant.model';
import { applyForAnAccount, getApplicant, getApplicantError, getApplicantLoading } from '../store/applicant';
import { getCamUserState } from '../store/cam-user-store';

// tslint:disable:member-ordering
@Injectable({ providedIn: 'root' })
export class CamUserFacade {
  constructor(private store: Store) {}

  camUserState$ = this.store.pipe(select(getCamUserState));
  applicant$ = this.store.pipe(select(getApplicant));
  applicantError$ = this.store.pipe(select(getApplicantError));
  applicantLoading$ = this.store.pipe(select(getApplicantLoading));

  applyForAnAccount(applicant: Applicant) {
    this.store.dispatch(applyForAnAccount({ applicant }));
  }
}
