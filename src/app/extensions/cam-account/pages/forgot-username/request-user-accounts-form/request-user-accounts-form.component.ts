import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { markAsDirtyRecursive } from 'ish-shared/forms/utils/form-utils';
import { SpecialValidators } from 'ish-shared/forms/validators/special-validators';

import { UsernameReminder } from '../../../models/username-reminder/username-reminder.model';

@Component({
  selector: 'camfil-request-user-accounts-form',
  templateUrl: './request-user-accounts-form.component.html',
  styleUrls: ['./request-user-accounts-form.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestUserAccountsFormComponent implements OnInit {
  @Input() error: HttpError;

  @Output() forgotUsername = new EventEmitter<UsernameReminder>();

  constructor(private fb: FormBuilder) {}

  form: FormGroup;
  submitted = false;

  emailValidator = [
    {
      error: 'required',
      message: 'camfil.account.email.error.required',
    },
    {
      error: 'email',
      message: 'camfil.account.email.error.email',
      ifNot: 'required',
    },
  ];

  ngOnInit() {
    this.createForm();
  }

  private createForm(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, SpecialValidators.email]],
      captcha: [''],
      captchaAction: ['forgotUsername'],
    });
  }

  submitForm() {
    if (this.form.invalid) {
      this.submitted = true;
      markAsDirtyRecursive(this.form);
      return;
    }

    const formValue = this.form.value;

    const request = { ...formValue };

    request.captcha = this.form.get('captcha').value;
    request.captchaAction = this.form.get('captchaAction').value;

    this.forgotUsername.emit(request);
  }

  get formDisabled() {
    return this.form.invalid && this.submitted;
  }
}
