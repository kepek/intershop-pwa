import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import { CHANNEL_CONFIGURATION } from 'ish-core/configurations/injection-keys';
import { AppFacade } from 'ish-core/facades/app.facade';
import { FeatureToggleService } from 'ish-core/feature-toggle.module';
import { ChannelConfiguration } from 'ish-core/models/channel-configuration/channel-configuration.model';
import { DeviceType } from 'ish-core/models/viewtype/viewtype.types';
import { CookiesService } from 'ish-core/utils/cookies/cookies.service';
import { whenTruthy } from 'ish-core/utils/operators';

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
  camfilChannel$: Observable<string>;
  gtmToken: string;
  gtmUrl: SafeUrl;
  private destroy$ = new Subject();

  constructor(
    private appFacade: AppFacade,
    @Inject(PLATFORM_ID) platformId: string,
    @Inject(CHANNEL_CONFIGURATION) private channelConfs: ChannelConfiguration[],
    private cookiesService: CookiesService,
    private featureToggleService: FeatureToggleService,
    private router: Router,
    private sanitizer: DomSanitizer,
    public dialog: MatDialog
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }
  get isIeBrowser() {
    const userAgent = window.navigator.userAgent;
    return userAgent.indexOf('MSIE ') > -1 || userAgent.indexOf('Trident/') > -1;
  }
  ngOnInit() {
    this.deviceType$ = this.appFacade.deviceType$;
    this.wrapperClasses$ = this.appFacade.appWrapperClasses$;
    this.camfilChannel$ = this.appFacade.getCamfilChannel$;
    if (this.featureToggleService.enabled('tracking') && this.cookiesService.cookieConsentFor('tracking')) {
      this.camfilChannel$.pipe(whenTruthy(), take(1), takeUntil(this.destroy$)).subscribe(camfilChannel => {
        const gtmToken = this.channelConfs
          .filter(item => item.channel === camfilChannel)
          .map(item => item.gtmContainerId)[0];
        this.gtmUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
          `https://www.googletagmanager.com/ns.html?id=${gtmToken}`
        );
        this.gtmToken = gtmToken;
      });
    }
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
}
