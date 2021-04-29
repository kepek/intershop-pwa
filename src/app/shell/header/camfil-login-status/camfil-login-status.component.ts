import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { AppFacade } from 'ish-core/facades/app.facade';
import { Channel } from 'ish-core/models/channel/channel.types';
import { User } from 'ish-core/models/user/user.model';
import { whenTruthy } from 'ish-core/utils/operators';

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
  countryByChannel: string;
  languageSymbol: string;

  private destroy$ = new Subject();

  constructor(private accountFacade: AccountFacade, private appFacade: AppFacade) {}

  ngOnInit() {
    this.user$ = this.accountFacade.user$;
    this.appFacade.getCamfilChannel$.pipe(whenTruthy(), take(1)).subscribe(channel => {
      this.countryByChannel = Object.entries(Channel).find(([, val]) => val === channel)[0];
    });

    this.appFacade.currentLocale$.pipe(whenTruthy(), takeUntil(this.destroy$)).subscribe(locale => {
      this.languageSymbol = locale?.value;
    });
  }

  setRedirectParam() {
    return { returnUrl: `/${String(this.countryByChannel).toLowerCase()}-${this.languageSymbol}/home` };
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
