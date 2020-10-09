import { Injectable } from '@angular/core';
import { pick } from 'lodash-es';
import { Observable, throwError } from 'rxjs';

import { ApiService } from 'ish-core/services/api/api.service';

import { ApplicantData } from '../../models/applicant/applicant.interface';
import { Applicant } from '../../models/applicant/applicant.model';

@Injectable({ providedIn: 'root' })
export class UserService {
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
}
