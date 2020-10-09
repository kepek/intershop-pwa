import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { Applicant } from '../models/applicant/applicant.model';
import { applyForAnAccount, getApplicant, getApplicantError, getApplicantLoading } from '../store/applicant';
import { getCamAccountState } from '../store/cam-account-store';

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
}
