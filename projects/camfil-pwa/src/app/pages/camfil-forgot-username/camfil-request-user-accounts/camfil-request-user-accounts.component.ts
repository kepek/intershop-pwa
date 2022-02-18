import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CamfilPwaFacade } from 'camfil-pwa/facades/camfil-pwa.facade';
import { CamfilApplicantReminder } from 'camfil-pwa/models/camfil-applicant-reminder/camfil-applicant-reminder.model';
import { Observable } from 'rxjs';

import { HttpError } from 'ish-core/models/http-error/http-error.model';

@Component({
  selector: 'camfil-request-user-accounts',
  templateUrl: './camfil-request-user-accounts.component.html',
  styleUrls: ['./camfil-request-user-accounts.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilRequestUserAccountsComponent implements OnInit {
  success$: Observable<boolean>;
  error$: Observable<HttpError>;
  loading$: Observable<boolean>;

  constructor(private camfilAccountFacade: CamfilPwaFacade) {}

  ngOnInit(): void {
    this.success$ = this.camfilAccountFacade.reminderSuccess$;
    this.error$ = this.camfilAccountFacade.reminderError$;
    this.loading$ = this.camfilAccountFacade.loading$;

    this.camfilAccountFacade.resetUsernameReminder();
  }

  requestApplicantReminder(data: CamfilApplicantReminder) {
    this.camfilAccountFacade.requestApplicantReminder(data);
  }
}
