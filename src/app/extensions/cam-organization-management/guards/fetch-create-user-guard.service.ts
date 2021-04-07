import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Observable, of } from 'rxjs';

import { whenTruthy } from 'ish-core/utils/operators';

import { CamOrganizationManagementFacade } from '../facades/cam-organization-management.facade';

@Injectable({
  providedIn: 'root',
})
export class FetchCreateUserGuard implements CanActivate {
  constructor(private organizationFacade: CamOrganizationManagementFacade) {}

  canActivate(): Observable<boolean> {
    this.organizationFacade.currentCustomer$.pipe(whenTruthy()).subscribe(({ id }) => {
      this.organizationFacade.loadCustomerRoles$(id);
    });

    return of(true);
  }
}
