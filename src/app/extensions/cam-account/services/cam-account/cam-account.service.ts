import { Injectable } from '@angular/core';
import { pick } from 'lodash-es';
import { Observable, throwError } from 'rxjs';

import { ApiService, AvailableOptions } from 'ish-core/services/api/api.service';

import { ApplicantData } from '../../models/applicant/applicant.interface';
import { Applicant } from '../../models/applicant/applicant.model';
import { UsernameReminder } from '../../models/username-reminder/username-reminder.model';
import { ChangeLanguagePayload } from '../../pages/account-profile/camfil-account-language-form/camfil-account-language-form.component';

@Injectable({ providedIn: 'root' })
export class CamAccountService {
  constructor(private apiService: ApiService) {}

  applyForAnAccount(data: Applicant): Observable<ApplicantData> {
    if (!data) {
      return throwError('applyForAnAccount() called without required body data');
    }

    return this.apiService.post<Applicant>('mailing/register-request', data, {
      captcha: pick(data, ['captcha', 'captchaAction']),
    });
  }

  /**
   * Request an email for the customer accounts connected with email.
   * @param data  The user data (email, firstName, lastName ) to identify the user.
   */
  requestUsernameReminder(data: UsernameReminder) {
    const options: AvailableOptions = {
      skipApiErrorHandling: true,
      captcha: pick(data, ['captcha', 'captchaAction']),
    };

    return this.apiService.post('mailing/remind-user-name', { answer: '', ...data }, options);
  }

  getCustomerUserPreferredLanguage(payload: Omit<ChangeLanguagePayload, 'languageCode'>) {
    if (!payload) {
      return throwError('getCustomerUserPreferredLanguage() called without required payload data');
    }

    const { customerId, userId } = payload;

    return this.apiService.post(`camfilcustomers/${customerId}/users/${userId}/preferredLanguage`);
  }

  updateCustomerUserPreferredLanguage(payload: ChangeLanguagePayload) {
    if (!payload) {
      return throwError('updateCustomerUserPreferredLanguage() called without required payload data');
    }

    const { customerId, userId, languageCode } = payload;

    return this.apiService.put(`camfilcustomers/${customerId}/users/${userId}/preferredLanguage`, {
      languageCode,
    });
  }
}
