import { Platform } from '@angular/cdk/platform';
import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { filter, first, takeUntil } from 'rxjs/operators';

import { AppFacade } from 'ish-core/facades/app.facade';
import { FeatureToggleService } from 'ish-core/feature-toggle.module';
import { DeviceType } from 'ish-core/models/viewtype/viewtype.types';
import { CookiesService } from 'ish-core/utils/cookies/cookies.service';
import { whenTruthy } from 'ish-core/utils/operators';
import { StatePropertiesService } from 'ish-core/utils/state-transfer/state-properties.service';

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
  gtmToken: string;
  gtmUrl: SafeUrl;

  private destroy$ = new Subject();

  constructor(
    private appFacade: AppFacade,
    @Inject(PLATFORM_ID) platformId: string,
    private cookiesService: CookiesService,
    private featureToggleService: FeatureToggleService,
    private router: Router,
    private sanitizer: DomSanitizer,
    public dialog: MatDialog,
    public platform: Platform,
    private stateProperties: StatePropertiesService
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

    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        filter(() => this.featureToggleService.enabled('tracking') && this.cookiesService.cookieConsentFor('tracking')),
        first(),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.initTracking();
      });
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

  private initTracking() {
    this.stateProperties
      .getStateOrEnvOrDefault<string>('GTM_TOKEN', 'gtmToken')
      .pipe(whenTruthy(), takeUntil(this.destroy$))
      .subscribe(gtmToken => {
        this.gtmUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
          `https://www.googletagmanager.com/ns.html?id=${gtmToken}`
        );
        this.gtmToken = gtmToken;
      });
  }
}
