import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

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
  get buttonDisabled() {
    return this.form.invalid && this.submitted;
  }
  @Output() submitAccountsRequest = new EventEmitter<UsernameReminder>();

  form: FormGroup;
  emailFormControl = new FormControl('', [Validators.required, SpecialValidators.email]);
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
    this.form = new FormGroup({
      email: this.emailFormControl,
    });
  }

  submitForm() {
    if (this.form.invalid) {
      this.submitted = true;
      markAsDirtyRecursive(this.form);
      return;
    }

    this.submitAccountsRequest.emit(this.form.value);
  }
}
