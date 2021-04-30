// tslint:disable: ish-ordered-imports project-structure
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges,
  SimpleChange,
  OnInit,
} from '@angular/core';

import { CamfilB2bRole } from '../../models/camfil-b2b-role/camfil-b2b-role.model';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatSelectionListChange } from '@angular/material/list';

@Component({
  selector: 'camfil-organization-user-roles-form',
  templateUrl: './camfil-organization-user-roles-form.component.html',
  styleUrls: ['./camfil-organization-user-roles-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class CamfilOrganizationUserRolesFormComponent implements OnInit, OnChanges {
  constructor(private fb: FormBuilder) {}

  @Input() set staticRoles(staticRoles: CamfilB2bRole[]) {
    this.staticRolesValue = staticRoles;
  }

  get staticRoles() {
    return this.staticRolesValue;
  }

  @Input() set roles(roles: CamfilB2bRole[]) {
    this.rolesValue = roles;
  }

  get roles() {
    return this.rolesValue;
  }

  @Input() set selectedRoles(selectedRoles: CamfilB2bRole[]) {
    this.selectedRolesValue = selectedRoles;
  }

  get selectedRoles() {
    return this.selectedRolesValue;
  }

  // Properties

  form: FormGroup;

  //  Input Properties -> Static Roles

  private staticRolesValue = [];

  // Input Properties -> Roles

  private rolesValue: CamfilB2bRole[] = [];

  // Input Properties -> Selected Roles

  private selectedRolesValue: CamfilB2bRole[] = [];

  // Outputs

  @Output() selectCustomerUserRoles = new EventEmitter<{ roleIDs: string[] }>();

  // Private Static Methods

  private static handlePropertyChange(
    changes: ComponentChanges<CamfilOrganizationUserRolesFormComponent>,
    propertyName?: string,
    fn?: (change: SimpleChange) => void
  ) {
    const property: SimpleChange = changes[propertyName];

    if (!property) {
      return;
    }

    if (JSON.stringify(property.previousValue) !== JSON.stringify(property.currentValue)) {
      fn(property);
    }
  }

  private static toRoleIDs(roles: CamfilB2bRole[]): string[] {
    return [].concat(roles).map(r => r?.id);
  }

  // Methods

  isDisabledRole(role: CamfilB2bRole) {
    return role.fixed || this.staticRoles?.map(r => r.id)?.includes(role.id);
  }

  // Handlers

  onCustomerUserRolesChange(selectionChange: MatSelectionListChange) {
    const roleIDs: string[] = [
      ...selectionChange?.source?.selectedOptions?.selected?.map(selectedOption => selectedOption.value),
    ];

    this.selectCustomerUserRoles.emit({ roleIDs });
  }

  // Hooks

  ngOnInit() {
    this.form = this.fb.group({
      roleIDs: new FormControl([]),
    });

    this.form?.patchValue({
      roleIDs: CamfilOrganizationUserRolesFormComponent.toRoleIDs(this.selectedRoles),
    });
  }

  ngOnChanges(changes: ComponentChanges<CamfilOrganizationUserRolesFormComponent>) {
    CamfilOrganizationUserRolesFormComponent.handlePropertyChange(
      changes,
      'selectedRoles',
      ({ currentValue, firstChange }) => {
        if (!firstChange) {
          this.form?.patchValue({
            roleIDs: CamfilOrganizationUserRolesFormComponent.toRoleIDs(currentValue),
          });
        }
      }
    );
  }
}
