import { Injectable } from '@angular/core';
import { pick } from 'lodash-es';
import { Observable, throwError } from 'rxjs';

import { ApiService } from 'ish-core/services/api/api.service';

import { ApplicantData } from '../../models/applicant/applicant.interface';
import { Applicant } from '../../models/applicant/applicant.model';
import { UsernameReminder } from '../../models/username-reminder/username-reminder.model';

@Injectable({ providedIn: 'root' })
export class CamAccountService {
  constructor(private apiService: ApiService) {}

  applyForAnAccount(data: Applicant): Observable<ApplicantData> {
    if (!data) {
      return throwError('applyForAnAccount() called without required body data');
    }

    return (
      this.apiService
        // TODO replace the api endpoint "/apply_for_an_account" when back-end is ready.
        .post<Applicant>('privatecustomers', data, {
          captcha: pick(data, ['captcha', 'captchaAction']),
        })
    );
  }

  /**
   * Request an email for the customer accounts connected with email.
   * @param data  The user data (email, firstName, lastName ) to identify the user.
   */
  requestUsernameReminder(data: UsernameReminder) {
    return this.apiService.post('security/customerAccounts', { answer: '', ...data });
  }
}
