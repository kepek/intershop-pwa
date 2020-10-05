import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { RegistrationUserMapper } from 'ish-core/models/user/registration-user.mapper';
import { RegistrationUser } from 'ish-core/models/user/registration-user.model';

/**
 * The Registration Page Container renders the customer registration form using the {@link CamfilRegistrationFormComponent}
 *
 */
@Component({
  templateUrl: './camfil-registration-page.component.html',
  styleUrls: ['./camfil-registration-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilRegistrationPageComponent implements OnInit {
  userError$: Observable<HttpError>;

  constructor(private accountFacade: AccountFacade, private router: Router) {}

  ngOnInit() {
    this.userError$ = this.accountFacade.userError$;
  }

  onCancel() {
    this.router.navigate(['/home']);
  }

  onCreate(body: RegistrationUser) {
    this.accountFacade.createUser(RegistrationUserMapper.fromData(body));
  }
}
