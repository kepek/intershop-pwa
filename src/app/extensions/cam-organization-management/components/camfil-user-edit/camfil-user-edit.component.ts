import { Component, OnDestroy, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Observable, Subject } from 'rxjs';

import { AccountFacade } from 'ish-core/facades/account.facade';

import { CamfilB2bUser } from '../../models/camfil-b2b-user/camfil-b2b-user.model';
import { CamfilConfirmationModalComponent } from '../camfil-user-customers-selection/camfil-confirmation-moda/camfil-confirmation-modal.component';

@Component({
  templateUrl: './camfil-user-edit.component.html',
  styleUrls: ['./camfil-user-edit.component.scss'],
})
export class CamfilUserEditComponent implements OnDestroy {
  @ViewChild(CamfilConfirmationModalComponent) modal: CamfilConfirmationModalComponent;
  selectedUser$: Observable<CamfilB2bUser>;
  user: CamfilB2bUser;
  userEditForm: FormGroup;
  selectRolesForm$: Observable<FormGroup>;
  private destroy$ = new Subject();

  constructor(public dialog: MatDialog, private formBuilder: FormBuilder, private accountFacade: AccountFacade) {}

  editUserProfileForm(userProfile: CamfilB2bUser) {
    this.userEditForm = this.formBuilder.group(
      {
        firstName: [userProfile.firstName, [Validators.required, Validators.maxLength(60)]],
        lastName: [userProfile.lastName, [Validators.required, Validators.maxLength(60)]],
        phone: [
          '',
          [
            Validators.required,
            Validators.pattern(
              '(([+]?[(]?[0-9]{1,3}[)]?)|([(]?[0-9]{4}[)]?))s*[)]?[-s.]?[(]?[0-9]{1,3}[)]?([-s.]?[0-9]{3})([-s.]?[0-9]{3,4})'
            ),
            Validators.maxLength(30),
          ],
        ],
        email: [userProfile.login, [Validators.required, Validators.email]],
      },
      { updateOn: 'blur' }
    );
  }

  get isUserLocked() {
    return !!this.user?.active;
  }

  submitForm(form) {
    const updatedUser = { ...this.user };
    Object.keys(form.controls).forEach(key => {
      if (form.controls[key].value && form.controls[key].valid) {
        updatedUser[key] = form.controls[key].value;
      }
    });
    console.log('updatedUser', updatedUser);
    // this.organizationFacade.updateCamUser(updatedUser);
  }
  resetUserPassword() {
    // TODO: add reset password action for selected user / check if works
    this.accountFacade.requestPasswordReminder({ email: this.user.email });
  }

  changeUserStatus() {
    const updatedUser = {
      ...this.user,
    };

    console.log('updatedUser', updatedUser);

    // this.organizationFacade.updateCamUser(updatedUser);
    this.openModal();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  openModal() {
    this.dialog.open(this.modal.show());
    this.modal.hide = () => this.dialog.closeAll();
  }
}
