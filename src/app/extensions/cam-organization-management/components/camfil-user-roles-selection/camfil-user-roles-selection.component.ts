import { Component, Input, OnDestroy, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';

import { CamfilB2bRole } from '../../models/camfil-b2b-role/camfil-b2b-role.model';
import { CamfilB2bUser } from '../../models/camfil-b2b-user/camfil-b2b-user.model';
import { CamfilConfirmationModalComponent } from '../camfil-user-customers-selection/camfil-confirmation-moda/camfil-confirmation-modal.component';

@Component({
  selector: 'camfil-user-roles-selection',
  templateUrl: './camfil-user-roles-selection.component.html',
  styleUrls: ['./camfil-user-roles-selection.component.scss'],
})
export class CamfilUserRolesSelectionComponent implements OnDestroy {
  @ViewChild(CamfilConfirmationModalComponent) modal: CamfilConfirmationModalComponent;
  @Input() selectedUser: CamfilB2bUser;

  selectRoleForm: FormGroup;

  private destroy$ = new Subject();
  roles: CamfilB2bRole[];
  roleCheckboxes: Array<{
    id: string;
    value: string;
    displayName: string;
    permissionDisplayNames: string[];
    checked: boolean;
  }>;

  constructor(public dialog: MatDialog) {}

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  initCheckboxes(roles: CamfilB2bRole[]) {
    return roles.map(role => ({
      id: role.id,
      value: role.id,
      displayName: role.displayName,
      permissionDisplayNames: role.permissionDisplayNames,
      checked: this.selectedUser.roleIDs.includes(role.id),
    }));
  }

  changeUserRoles(change: MatCheckboxChange) {
    const checkboxIndex = this.roleCheckboxes.indexOf(
      this.roleCheckboxes.filter(role => role.id === change.source.value)[0]
    );
    this.roleCheckboxes[checkboxIndex] = { ...this.roleCheckboxes[checkboxIndex], checked: change.checked };

    const currentUserRoles = this.roleCheckboxes.filter(role => role.checked);
    const updatedUser = {
      ...this.selectedUser,
      roleIDs: currentUserRoles.length ? currentUserRoles.map(r => r.id) : [],
    };

    console.log('updateUser', updatedUser);

    // this.organizationFacade.updateCamUser(updatedUser);

    this.openModal();
  }

  openModal() {
    this.dialog.open(this.modal.show());
    this.modal.hide = () => this.dialog.closeAll();
  }
}
