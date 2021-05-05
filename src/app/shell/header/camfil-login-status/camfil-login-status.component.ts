import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { User } from 'ish-core/models/user/user.model';

@Component({
  selector: 'camfil-login-status',
  templateUrl: './camfil-login-status.component.html',
  styleUrls: ['./camfil-login-status.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilLoginStatusComponent implements OnInit, OnDestroy {
  @Input() logoutOnly = false;
  @Input() view: 'auto' | 'small' | 'full' = 'auto';

  user$: Observable<User>;

  private destroy$ = new Subject();

  get redirectParam() {
    return {
      returnUrl: `/home`,
    };
  }

  constructor(private accountFacade: AccountFacade) {}

  ngOnInit() {
    this.user$ = this.accountFacade.user$;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
