import { Injectable } from '@angular/core';
import { CamfilApplicantReminder } from 'camfil-pwa/models/camfil-applicant-reminder/camfil-applicant-reminder.model';
import { CamfilApplicantData } from 'camfil-pwa/models/camfil-applicant/camfil-applicant.interface';
import { CamfilApplicant } from 'camfil-pwa/models/camfil-applicant/camfil-applicant.model';
import { CamfilLangMapper } from 'camfil-pwa/models/camfil-lang/camfil-lang.mapper';
import { CamfilLangData, CamfilLangSubject } from 'camfil-pwa/models/camfil-lang/camfil-lang.model';
import { pick } from 'lodash-es';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { ApiService, AvailableOptions } from 'ish-core/services/api/api.service';

@Injectable({ providedIn: 'root' })
export class CamfilUserService {
  constructor(private apiService: ApiService) {}

  applyForAnAccount(data: CamfilApplicant): Observable<CamfilApplicantData> {
    if (!data) {
      return throwError('applyForAnAccount() called without required body data');
    }

    return this.apiService.post<CamfilApplicant>('mailing/register-request', data, {
      captcha: pick(data, ['captcha', 'captchaAction']),
    });
  }

  /**
   * Request an email for the customer accounts connected with email.
   * @param data  The user data (email, firstName, lastName ) to identify the user.
   */
  requestApplicantReminder(data: CamfilApplicantReminder) {
    const options: AvailableOptions = {
      skipApiErrorHandling: true,
      captcha: pick(data, ['captcha', 'captchaAction']),
    };

    return this.apiService.post('mailing/remind-user-name', { answer: '', ...data }, options);
  }

  getCustomerUserPreferredLanguage(
    subject: Omit<CamfilLangSubject, 'lang'>
  ): Observable<Pick<CamfilLangSubject, 'lang'>> {
    if (!subject) {
      return throwError('getCustomerUserPreferredLanguage() called without required payload data');
    }

    const { customerId, userId } = subject;

    return this.apiService.get<CamfilLangData>(`camfilcustomers/${customerId}/users/${userId}/preferredLanguage`).pipe(
      map(CamfilLangMapper.fromData),
      // TODO (extMlk): Remove catchError when BE will fix security issues.
      catchError(() => of({ lang: 'en_GB' }))
    );
  }

  updateCustomerUserPreferredLanguage(subject: CamfilLangSubject): Observable<Pick<CamfilLangSubject, 'lang'>> {
    if (!subject) {
      return throwError('updateCustomerUserPreferredLanguage() called without required payload data');
    }

    const { customerId, userId, lang } = subject;

    const body = CamfilLangMapper.toData(subject);

    return this.apiService
      .put<CamfilLangData>(`camfilcustomers/${customerId}/users/${userId}/preferredLanguage`, body)
      .pipe(
        map(CamfilLangMapper.fromData),
        // TODO (extMlk): Remove catchError when BE will fix security issues.
        catchError(() => of({ lang }))
      );
  }

  loadPreferredTitles() {
    return this.apiService.get<string[]>('preferredtitles');
  }
}
