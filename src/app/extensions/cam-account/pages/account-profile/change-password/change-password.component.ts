import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { markAsDirtyRecursive } from 'ish-shared/forms/utils/form-utils';
import { SpecialValidators } from 'ish-shared/forms/validators/special-validators';

@Component({
  selector: 'camfil-account-change-password-form',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss', '../account-profile/account-profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangePasswordComponent implements OnInit {
  form: FormGroup;
  submitted = false;

  constructor(private accountFacade: AccountFacade) {}

  currPassFormControl = new FormControl('', [Validators.required, SpecialValidators.password]);
  passwordFormControl = new FormControl('', [Validators.required, SpecialValidators.password]);
  passConfFormControl = new FormControl('', [Validators.required, SpecialValidators.password]);

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
