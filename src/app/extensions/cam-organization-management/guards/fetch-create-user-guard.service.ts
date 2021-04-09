import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Observable, of } from 'rxjs';
import { take } from 'rxjs/operators';

import { whenTruthy } from 'ish-core/utils/operators';

import { CamOrganizationManagementFacade } from '../facades/cam-organization-management.facade';

@Injectable({
  providedIn: 'root',
})
export class FetchCreateUserGuard implements CanActivate {
  constructor(private organizationFacade: CamOrganizationManagementFacade) {}

  canActivate(): Observable<boolean> {
    this.organizationFacade.currentCustomer$.pipe(whenTruthy(), take(1)).subscribe(customer => {
      this.organizationFacade.loadCustomerUser$(customer.id, undefined);
    });

    return of(true);
  }
}
