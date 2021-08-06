import { Injectable } from '@angular/core';
import { pick } from 'lodash-es';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { ApiService, AvailableOptions } from 'ish-core/services/api/api.service';

import { ApplicantData } from '../../models/applicant/applicant.interface';
import { Applicant } from '../../models/applicant/applicant.model';
import { LangMapper } from '../../models/lang/lang.mapper';
import { LangData, LangSubject } from '../../models/lang/lang.model';
import { UsernameReminder } from '../../models/username-reminder/username-reminder.model';

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

  getCustomerUserPreferredLanguage(subject: Omit<LangSubject, 'lang'>): Observable<Pick<LangSubject, 'lang'>> {
    if (!subject) {
      return throwError('getCustomerUserPreferredLanguage() called without required payload data');
    }

    const { customerId, userId } = subject;

    return this.apiService.get<LangData>(`camfilcustomers/${customerId}/users/${userId}/preferredLanguage`).pipe(
      map(LangMapper.fromData),
      // TODO (extMlk): Remove catchError when BE will fix security issues.
      catchError(() => of({ lang: 'en_GB' }))
    );
  }

  updateCustomerUserPreferredLanguage(subject: LangSubject): Observable<Pick<LangSubject, 'lang'>> {
    if (!subject) {
      return throwError('updateCustomerUserPreferredLanguage() called without required payload data');
    }

    const { customerId, userId, lang } = subject;

    const body = LangMapper.toData(subject);

    return this.apiService.put<LangData>(`camfilcustomers/${customerId}/users/${userId}/preferredLanguage`, body).pipe(
      map(LangMapper.fromData),
      // TODO (extMlk): Remove catchError when BE will fix security issues.
      catchError(() => of({ lang }))
    );
  }

  loadPreferredTitles() {
    return this.apiService.get<string[]>('preferredtitles');
  }
}
