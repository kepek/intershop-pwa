import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { Observable } from 'rxjs';
import { mapTo, tap } from 'rxjs/operators';

import { CamOrganizationManagementFacade } from '../facades/cam-organization-management.facade';

@Injectable({
  providedIn: 'root',
})
export class FetchCustomersUsersGuard implements CanActivate {
  constructor(private organizationFacade: CamOrganizationManagementFacade) {}

  canActivate(): Observable<boolean> {
    return this.organizationFacade.usersCount$.pipe(
      tap(count => {
        if (count <= 1) {
          this.organizationFacade.loadCustomersUsers$();
        }
      }),
      mapTo(true)
    );
  }
}
