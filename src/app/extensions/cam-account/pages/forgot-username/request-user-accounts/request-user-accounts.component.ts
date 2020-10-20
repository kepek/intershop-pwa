import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { HttpError } from 'ish-core/models/http-error/http-error.model';

import { CamAccountFacade } from '../../../facades/cam-account.facade';
import { UsernameReminder } from '../../../models/username-reminder/username-reminder.model';

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

  constructor(private camAccountFacade: CamAccountFacade) {}

  ngOnInit(): void {
    this.success$ = this.camAccountFacade.usernameReminderSuccess$;
    this.error$ = this.camAccountFacade.usernameReminderError$;
    this.loading$ = this.camAccountFacade.loading$;

    this.camAccountFacade.resetUsernameReminder();
  }

  requestUsernameReminder(data: UsernameReminder) {
    this.camAccountFacade.requestUsernameReminder(data);
  }
}
