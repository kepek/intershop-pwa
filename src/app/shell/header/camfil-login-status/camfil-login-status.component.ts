import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterEvent } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { distinctUntilChanged, filter, map, take, takeUntil } from 'rxjs/operators';

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

  returnUrl: string;
  returnUrlChange: boolean;

  private destroy$ = new Subject();

  constructor(
    private accountFacade: AccountFacade,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private appFacade: AppFacade
  ) {}

  ngOnInit() {
    this.user$ = this.accountFacade.user$;

    // TODO: based on Channel because camfilConfiguration is not updated after logout
    this.appFacade.getChannel$?.pipe(whenTruthy(), take(1)).subscribe(channel => {
      this.returnUrlChange = channel === Channel.FI;
    });

    this.router?.events
      ?.pipe(
        filter((event: RouterEvent) => event instanceof NavigationEnd),
        map((event: RouterEvent) => event?.url),
        map(prevUrl => {
          const link = 'https://example.com';
          const url = new URL(link + prevUrl);
          url.searchParams.delete('returnUrl');
          return url.toString().replace(link, '');
        }),
        filter(url => !['/login', '/register', '/forgotPassword', '/forgotUsername'].includes(url)),
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      )
      .subscribe(url => {
        this.returnUrl = this.returnUrlChange && ['/home'].includes(url) ? '/account/camcards' : url;
        this.cdr.detectChanges();
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
