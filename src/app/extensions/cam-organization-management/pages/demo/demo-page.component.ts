import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { CamOrganizationManagementFacade } from '../../facades/cam-organization-management.facade';
import { CamfilB2bUser } from '../../models/camfil-b2b-user/camfil-b2b-user.model';

@Component({
  selector: 'camfil-users-page',
  templateUrl: './demo-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
// tslint:disable-next-line:component-creation-test
export class DemoPageComponent implements OnInit {
  constructor(public organizationFacade: CamOrganizationManagementFacade) {}

  michalCustomerId = 'GkIKAQJEZ9QAAAF3wRaYbKA3';
  michalUserId = 'MrcKAQFEcUcAAAF38_6Aj9t5';

  marcinCustomerId = 'Is8KAQJFer0AAAF3Naobk5ri';
  marcinUserId = 'JlwKAQFEILIAAAF4qmS4uxPZ';

  users$: Observable<CamfilB2bUser[]>;

  ngOnInit() {
    this.users$ = this.organizationFacade.getUsers$();
  }

  loadUsers() {
    this.organizationFacade.loadCustomersUsers$();
  }

  loadUser(customerId: string, userId: string) {
    this.organizationFacade.loadCustomerUser$(customerId, userId);
  }

  activateUser(customerId: string, userId: string) {
    this.organizationFacade.activateCustomerUser$(customerId, userId);
  }

  deactivateUser(customerId: string, userId: string) {
    this.organizationFacade.deactivateCustomerUser$(customerId, userId);
  }
}
