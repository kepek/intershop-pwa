import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { markAsDirtyRecursive } from 'ish-shared/forms/utils/form-utils';
import { SpecialValidators } from 'ish-shared/forms/validators/special-validators';

@Component({
  selector: 'camfil-account-change-password-form',
  templateUrl: './camfil-change-password.component.html',
  styleUrls: [
    './camfil-change-password.component.scss',
    '../camil-account-profile/camfil-account-profile.component.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilChangePasswordComponent implements OnInit {
  form: FormGroup;
  submitted = false;

  constructor(private accountFacade: AccountFacade) {}

  currPassFormControl = new FormControl('', [Validators.required, SpecialValidators.password]);
  passwordFormControl = new FormControl('', [Validators.required, SpecialValidators.password]);
  passConfFormControl = new FormControl('', [Validators.required, SpecialValidators.password]);

  currPasswordValidator = [
    {
      error: 'required',
      message: 'camfil.account.update_password.old_password.error.required',
    },
    {
      error: 'password',
      message: 'camfil.account.update_password.old_password.error.incorrect',
      ifNot: 'required',
    },
  ];

  passwordValidator = [
    {
      error: 'required',
      message: 'camfil.account.update_password.old_password.error.required',
    },
    {
      error: 'minLength',
      message: 'camfil.account.update_password.new_password.error.length',
      ifNot: 'required',
    },
    {
      error: 'password',
      message: 'camfil.account.update_password.old_password.error.incorrect',
      ifNot: 'required',
    },
  ];

  passwordConfirmationValidator = [
    {
      error: 'required',
      message: 'camfil.account.register.password_confirmation.error.default',
    },
    {
      error: 'password',
      message: 'camfil.account.update_password.new_password.error.regexp',
      ifNot: 'required',
    },
    {
      error: 'equalTo',
      message: 'camfil.account.update_password.confirm_password.error.stringcompare',
      ifNot: 'required',
    },
  ];

  ngOnInit() {
    this.form = new FormGroup(
      {
        currentPassword: this.currPassFormControl,
        password: this.passwordFormControl,
        passwordConfirmation: this.passConfFormControl,
      },
      SpecialValidators.equalTo('passwordConfirmation', 'password')
    );
  }

  submit() {
    if (this.form.invalid) {
      this.submitted = true;
      markAsDirtyRecursive(this.form);
      return;
    }

    this.updateUserPassword();
  }

  get buttonDisabled() {
    return this.form.invalid && this.submitted;
  }

  updateUserPassword() {
    const payload = {
      password: this.form.get('password').value,
      currentPassword: this.form.get('currentPassword').value,
    };

    this.accountFacade.updateUserPassword(payload);
  }
}
