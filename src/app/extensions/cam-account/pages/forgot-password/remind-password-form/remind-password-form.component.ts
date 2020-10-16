import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { PasswordReminder } from 'ish-core/models/password-reminder/password-reminder.model';
import { markAsDirtyRecursive } from 'ish-shared/forms/utils/form-utils';

/**
 * The Request Reminder Form Component displays a Forgot Password Request Reminder form and triggers the submit.
 *
 * @example
 * <ish-remind-password-form
 *               (submitPasswordReminder)="requestPasswordReminder($event)"
 * ></ish-remind-password-form>
 */
@Component({
  selector: 'camfil-remind-password-form',
  templateUrl: './remind-password-form.component.html',
  styleUrls: ['./remind-password-form.components.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RemindPasswordFormComponent implements OnInit {
  /**
   * Submit the form data to trigger the request for a password reminder.
   */
  @Output() submitPasswordReminder = new EventEmitter<PasswordReminder>();

  form: FormGroup;
  usernameFormControl = new FormControl('', [Validators.required]);
  submitted = false;

  errorValidator = [
    {
      error: 'required',
      message: 'camfil.account.forgotdata.error.username.required',
    },
  ];

  ngOnInit() {
    this.form = new FormGroup({
      email: this.usernameFormControl,
      captcha: new FormControl(''),
      captchaAction: new FormControl('forgotPassword'),
    });
  }

  get buttonDisabled() {
    return this.form.invalid && this.submitted;
  }

  submitForm() {
    if (this.form.invalid) {
      this.submitted = true;
      markAsDirtyRecursive(this.form);
      return;
    }

    this.submitPasswordReminder.emit(this.form.value);
  }
}
