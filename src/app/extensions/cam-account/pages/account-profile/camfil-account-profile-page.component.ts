import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { AppFacade } from 'ish-core/facades/app.facade';
import { Customer } from 'ish-core/models/customer/customer.model';
import { Locale } from 'ish-core/models/locale/locale.model';
import { User } from 'ish-core/models/user/user.model';

import { CamAccountFacade } from '../../facades/cam-account.facade';
import { LangSubject } from '../../models/lang/lang.model';

@Component({
  selector: 'camfil-account-profile-page',
  templateUrl: './camfil-account-profile-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilAccountProfilePageComponent implements OnInit {
  user$: Observable<User>;
  customer$: Observable<Customer>;
  locale$: Observable<Locale>;
  availableLocales$: Observable<Locale[]>;

  constructor(
    private accountFacade: AccountFacade,
    private appFacade: AppFacade,
    private camAccountFacade: CamAccountFacade
  ) {}

  ngOnInit() {
    this.user$ = this.accountFacade.user$;
    this.customer$ = this.accountFacade.customer$;
    this.locale$ = this.appFacade.currentLocale$;
    this.availableLocales$ = this.appFacade.availableLocalesByCountryCode$;
  }

  changeLanguage(subject: LangSubject) {
    this.camAccountFacade.updateCustomerUserPreferredLanguage$(subject);
  }
}
