import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { markAsDirtyRecursive } from 'ish-shared/forms/utils/form-utils';
import { SpecialValidators } from 'ish-shared/forms/validators/special-validators';

/**
 * The Update Password Form Component displays a Forgot Password Update Password form and triggers the submit.
 *
 * @example
 * <camfil-update-password-form (submitPassword)="submitPassword($event)"></camfil-update-password-form>
 */
@Component({
  selector: 'camfil-update-password-form',
  templateUrl: './camfil-update-password-form.component.html',
  styleUrls: ['./camfil-update-password-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilUpdatePasswordFormComponent implements OnInit {
  /**
   * Submit the form data to trigger the request for a password change.
   */
  @Output() submitPassword = new EventEmitter<{ password: string }>();

  password: string;

  form: FormGroup;
  submitted = false;

  passwordFormControl = new FormControl('', [Validators.required, SpecialValidators.password]);
  passwordConfirmationFormControl = new FormControl('', [Validators.required, SpecialValidators.password]);

  passwordValidator = [
    {
      error: 'required',
      message: 'camfil.account.update_password.new_password.error.required',
    },
    {
      error: 'password',
      message: 'camfil.account.update_password.new_password.error.password',
      ifNot: 'required',
    },
  ];

  passwordConfirmationValidator = [
    {
      error: 'required',
      message: 'camfil.account.update_password.new_password.error.required',
    },
    {
      error: 'password',
      message: 'camfil.account.update_password.new_password.error.regexp',
      ifNot: 'required',
    },
    {
      error: 'equalTo',
      message: 'camfil.account.update_password.confirm_password.error.stringcompare',
    },
  ];

  ngOnInit() {
    this.form = new FormGroup(
      {
        password: this.passwordFormControl,
        passwordConfirmation: this.passwordConfirmationFormControl,
      },
      SpecialValidators.equalTo('passwordConfirmation', 'password')
    );
  }

  submitPasswordForm() {
    if (this.form.invalid) {
      this.submitted = true;
      markAsDirtyRecursive(this.form);
      return;
    }

    this.submitPassword.emit({
      password: this.form.get('password').value,
    });
  }

  get buttonDisabled() {
    return this.form.invalid && this.submitted;
  }
}
