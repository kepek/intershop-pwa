import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { Customer } from 'ish-core/models/customer/customer.model';
import { Locale } from 'ish-core/models/locale/locale.model';
import { User } from 'ish-core/models/user/user.model';

import { LangSubject } from '../../../models/lang/lang.model';

@Component({
  selector: 'camfil-account-profile',
  templateUrl: './camfil-account-profile.component.html',
  styleUrls: ['./camfil-account-profile.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilAccountProfileComponent {
  @Input() user: User;
  @Input() customer: Customer;
  @Input() locale: Locale;
  @Input() availableLocales: Locale[];

  @Output() changeLanguage = new EventEmitter<LangSubject>();

  onChangeLanguage(subject: LangSubject) {
    this.changeLanguage.emit(subject);
  }
}
