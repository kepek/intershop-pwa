import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterEvent } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { distinctUntilChanged, filter, map, takeUntil } from 'rxjs/operators';

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

  returnUrl = '/home';

  private destroy$ = new Subject();

  constructor(private accountFacade: AccountFacade, private router: Router, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.user$ = this.accountFacade.user$;
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
        this.returnUrl = url;
        this.cdr.detectChanges();
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
