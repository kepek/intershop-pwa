import { Platform } from '@angular/cdk/platform';
import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';

import { AppFacade } from 'ish-core/facades/app.facade';
import { DeviceType } from 'ish-core/models/viewtype/viewtype.types';

/**
 * The App Component provides the application frame for the single page application.
 * In addition to the page structure (header, main section, footer)
 * it holds the global functionality to present a cookie acceptance banner.
 */
@Component({
  selector: 'ish-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements OnInit, OnDestroy {
  @ViewChild('cookie', { static: true })
  isBrowser: boolean;
  wrapperClasses$: Observable<string[]>;
  deviceType$: Observable<DeviceType>;
  channel$: Observable<string>;

  private destroy$ = new Subject();

  constructor(
    private appFacade: AppFacade,
    @Inject(PLATFORM_ID) platformId: string,
    private router: Router,
    public dialog: MatDialog,
    public platform: Platform
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  get isIeBrowser() {
    return this.platform.TRIDENT;
  }

  ngOnInit() {
    this.deviceType$ = this.appFacade.deviceType$;
    this.wrapperClasses$ = this.appFacade.appWrapperClasses$;
    this.channel$ = this.appFacade.getChannel$;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get _router(): Router {
    return this.router;
  }

  set _router(value: Router) {
    this.router = value;
  }

  isCheckoutPage() {
    return this.router.url.includes('/checkout');
  }

  isProductDetailPage() {
    const re = new RegExp('/(.*-)?sku(.*)$');
    return re.test(this.router.url);
  }
}
