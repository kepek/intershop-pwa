import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { concatMap, first } from 'rxjs/operators';

import { AppFacade } from 'ish-core/facades/app.facade';
import { ApiService } from 'ish-core/services/api/api.service';
import {CamfilCustomerRegistrationType} from "ish-core/models/camfil-customer/camfil-customer.model";


/**
 * The User Service handles the registration related interaction with the 'customers' REST API.
 */
@Injectable({ providedIn: 'root' })
export class CamfilUserService {
  constructor(private apiService: ApiService, private appFacade: AppFacade) {}

  /**
   * Create a new user for the given data.
   * @param body  The user data (customer, user, credentials, address) to create a new user.
   */
  createUser(body: CamfilCustomerRegistrationType): Observable<void> {
    if (!body || !body.firstName || !body.lastName || !body.email || !body.customerName) {
      return throwError('createUser() called without required body data');
    }

    let newCustomer: CamfilCustomerRegistrationType;
    newCustomer = body;

    return this.appFacade.isAppTypeREST$.pipe(
      first(),
      concatMap(isAppTypeRest =>
        this.apiService.post<void>(
          AppFacade.getCustomerRestResource(false, isAppTypeRest),
          newCustomer
        )
      )
    );
  }
}
