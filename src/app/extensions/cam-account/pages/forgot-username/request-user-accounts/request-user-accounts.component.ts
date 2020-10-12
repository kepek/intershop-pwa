import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { UsernameReminder } from 'ish-core/models/username-reminder/username-reminder.model';

@Component({
  selector: 'camfil-request-user-accounts',
  templateUrl: './request-user-accounts.component.html',
  styleUrls: ['./request-user-accounts.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RequestUserAccountsComponent implements OnInit {
  success$: Observable<boolean>;
  error$: Observable<HttpError>;
  loading$: Observable<boolean>;

  accounts$: Observable<String[]>;

  constructor(private accountFacade: AccountFacade) {}

  ngOnInit(): void {
    this.success$ = this.accountFacade.usernameReminderSuccess$;
    this.error$ = this.accountFacade.usernameReminderError$;
    this.loading$ = this.accountFacade.userLoading$;
    this.accounts$ = this.accountFacade.accounts$();

    this.accountFacade.resetUsernameReminder();
  }

  requestUsernameReminder(data: UsernameReminder) {
    this.accountFacade.requestUsernameReminder(data);
  }
}
