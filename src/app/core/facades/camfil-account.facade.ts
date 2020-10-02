import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { CamfilCustomerRegistrationType } from 'ish-core/models/camfil-customer/camfil-customer.model';
import { Credentials } from 'ish-core/models/credentials/credentials.model';
import { getUserRoles } from 'ish-core/store/customer/authorization';
import {
  camfilCreateUser,
  getLoggedInUser,
  getUserAuthorized,
  getUserError,
  getUserLoading,
  loginUser,
} from 'ish-core/store/customer/user';

// tslint:disable:member-ordering
@Injectable({ providedIn: 'root' })
export class CamfilAccountFacade {
  constructor(private store: Store) {}

  // USER

  user$ = this.store.pipe(select(getLoggedInUser));
  userError$ = this.store.pipe(select(getUserError));
  userLoading$ = this.store.pipe(select(getUserLoading));
  isLoggedIn$ = this.store.pipe(select(getUserAuthorized));
  roles$ = this.store.pipe(select(getUserRoles));

  loginUser(credentials: Credentials) {
    this.store.dispatch(loginUser({ credentials }));
  }

  createUser(body: CamfilCustomerRegistrationType) {
    this.store.dispatch(camfilCreateUser(body));
  }
}
