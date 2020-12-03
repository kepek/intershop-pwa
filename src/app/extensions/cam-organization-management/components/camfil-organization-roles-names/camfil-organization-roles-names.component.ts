// tslint:disable: ish-ordered-imports ban-specific-imports project-structure
import { Component, Input, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import { CamfilB2bRole } from '../../models/camfil-b2b-role/camfil-b2b-role.model';
import { CamOrganizationManagementFacade } from '../../facades/cam-organization-management.facade';

@Component({
  selector: 'camfil-organization-roles-names',
  templateUrl: './camfil-organization-roles-names.component.html',
  styleUrls: ['./camfil-organization-roles-names.component.scss'],
})
// tslint:disable-next-line:component-creation-test
export class CamfilOrganizationRolesNamesComponent implements OnInit {
  @Input() roleIDs: string[];

  roles$: Observable<CamfilB2bRole[]>;

  constructor(private organizationFacade: CamOrganizationManagementFacade) {}

  ngOnInit() {
    this.roles$ = this.organizationFacade.getSelectedRoles$(this.roleIDs);
  }
}
