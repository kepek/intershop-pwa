import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { Customer } from 'ish-core/models/customer/customer.model';
import { Locale } from 'ish-core/models/locale/locale.model';
import { User } from 'ish-core/models/user/user.model';
import { markAsDirtyRecursive } from 'ish-shared/forms/utils/form-utils';

import { LangSubject } from '../../../models/lang/lang.model';

enum FormControlName {
  Lang = 'lang',
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

  @Output() submit = new EventEmitter<LangSubject>();

  form: FormGroup;
  FormControlName = FormControlName;
  submitted = false;

  ngOnInit() {
    this.form = new FormGroup({
      [FormControlName.Lang]: new FormControl(this?.user?.preferredLanguage, [Validators.required]),
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.submitted = true;
      markAsDirtyRecursive(this.form);
      return;
    }

    const subject = {
      customerId: this.customer?.customerNo,
      userId: '-',
      lang: this?.form?.get(FormControlName.Lang)?.value,
    };

    this.submit.emit(subject);
  }
}
