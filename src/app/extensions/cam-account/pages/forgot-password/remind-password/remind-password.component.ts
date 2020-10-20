import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { PasswordReminder } from 'ish-core/models/password-reminder/password-reminder.model';

/**
 * The Request Reminder Component handles the interaction for requesting a password reminder email.
 * See also {@link RequestReminderFormComponent}.
 */
@Component({
  selector: 'camfil-remind-password',
  templateUrl: './remind-password.component.html',
  styleUrls: ['./remind-password.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RemindPasswordComponent implements OnInit {
  success$: Observable<boolean>;
  error$: Observable<HttpError>;
  loading$: Observable<boolean>;

  constructor(private accountFacade: AccountFacade) {}

  ngOnInit(): void {
    this.success$ = this.accountFacade.passwordReminderSuccess$;
    this.error$ = this.accountFacade.passwordReminderError$;
    this.loading$ = this.accountFacade.userLoading$;

    this.accountFacade.resetPasswordReminder();
  }

  requestPasswordReminder(data: PasswordReminder) {
    this.accountFacade.requestPasswordReminder(data);
  }
}
