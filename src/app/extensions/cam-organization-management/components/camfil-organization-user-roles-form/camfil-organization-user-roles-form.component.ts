// tslint:disable: ish-ordered-imports project-structure
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, OnInit } from '@angular/core';

import { CamfilB2bRole } from '../../models/camfil-b2b-role/camfil-b2b-role.model';

@Component({
  selector: 'camfil-organization-user-roles-form',
  templateUrl: './camfil-organization-user-roles-form.component.html',
  styleUrls: ['./camfil-organization-user-roles-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class CamfilOrganizationUserRolesFormComponent implements OnInit {
  // Static Roles

  @Input()
  get staticRoles() {
    return this.staticRolesValue;
  }
  set staticRoles(staticRoles: CamfilB2bRole[]) {
    this.staticRolesValue = staticRoles;
  }

  private staticRolesValue = [];

  // Roles

  @Input()
  get roles() {
    return this.rolesValue;
  }
  set roles(roles: (CamfilB2bRole & { disabled?: boolean })[]) {
    this.rolesValue = roles;
  }
  private rolesValue: (CamfilB2bRole & { disabled?: boolean })[] = [];

  // Selected Roles

  @Input()
  get selectedRoles() {
    return this.selectedRolesValue;
  }
  set selectedRoles(selectedRoles: CamfilB2bRole[]) {
    this.selectedRolesValue = selectedRoles;
  }
  private selectedRolesValue: CamfilB2bRole[] = [];

  // Properties

  selectedRoleIDs: string[] = [];

  // Outputs

  @Output() selectCustomerUserRoles = new EventEmitter<{ roleIDs: string[] }>();

  // Handlers

  onCustomerUserRolesChange() {
    this.selectCustomerUserRoles.emit({ roleIDs: this.selectedRoleIDs });
  }

  // Hooks

  ngOnInit() {
    this.selectedRoleIDs = this.selectedRoles?.map(role => role.id);
  }

  // Methods

  isDisabledRole(role: CamfilB2bRole) {
    return role.fixed || this.staticRoles?.map(r => r.id)?.includes(role.id);
  }
}
