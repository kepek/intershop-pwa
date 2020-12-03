import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate } from '@angular/router';
import { Observable, of } from 'rxjs';

import { CamOrganizationManagementFacade } from '../facades/cam-organization-management.facade';

@Injectable({
  providedIn: 'root',
})
export class FetchCustomerUserGuard implements CanActivate {
  constructor(private organizationFacade: CamOrganizationManagementFacade) {}

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    const customerId = route.paramMap.get('CamfilB2BCustomerId');
    const userId = route.paramMap.get('CamfilB2BUserId');

    this.organizationFacade.loadCustomerUser$(customerId, userId);

    return of(true);
  }
}
