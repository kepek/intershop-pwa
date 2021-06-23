import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Customer } from 'ish-core/models/customer/customer.model';
import { Locale } from 'ish-core/models/locale/locale.model';
import { User } from 'ish-core/models/user/user.model';
import { markAsDirtyRecursive } from 'ish-shared/forms/utils/form-utils';

export interface ChangeLanguagePayload {
  customerId: string;
  userId: string;
  languageCode: string;
}

@Component({
  selector: 'camfil-account-language-form',
  templateUrl: './camfil-account-language-form.component.html',
  styleUrls: [
    './camfil-account-language-form.component.scss',
    '../camfil-account-profile/camfil-account-profile.component.scss',
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilAccountLanguageFormComponent implements OnInit {
  @Input() user: User;
  @Input() customer: Customer;

  @Input() availableLocales: Locale[];
  @Input() locale: Locale;

  @Output() submit = new EventEmitter<ChangeLanguagePayload>();

  form: FormGroup;
  submitted = false;

  languageCode = new FormControl('', [Validators.required]);

  ngOnInit() {
    this.form = new FormGroup({
      languageCode: this.languageCode,
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.submitted = true;
      markAsDirtyRecursive(this.form);
      return;
    }

    const payload = {
      userId: this.user?.login,
      customerId: this.customer?.customerNo,
      languageCode: this.form.get('languageCode').value,
    };

    console.log('camfil-account-language-form@onSubmit', payload);

    this.submit.emit(payload);
  }
}
