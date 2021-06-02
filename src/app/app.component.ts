import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { CHANNEL_CONFIGURATION } from 'ish-core/configurations/injection-keys';
import { AppFacade } from 'ish-core/facades/app.facade';
import { FeatureToggleService } from 'ish-core/feature-toggle.module';
import { ChannelConfiguration } from 'ish-core/models/channel-configuration/channel-configuration.model';
import { DeviceType } from 'ish-core/models/viewtype/viewtype.types';
import { getCamfilChannel } from 'ish-core/store/core/configuration';
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
export class AppComponent implements OnInit {
  @ViewChild('cookie', { static: true })
  isBrowser: boolean;
  wrapperClasses$: Observable<string[]>;
  deviceType$: Observable<DeviceType>;
  gtmToken: string;

  constructor(
    private appFacade: AppFacade,
    @Inject(PLATFORM_ID) platformId: string,
    @Inject(CHANNEL_CONFIGURATION) public channelConfs: ChannelConfiguration[],
    store: Store,
    cookiesService: CookiesService,
    featureToggleService: FeatureToggleService,
    private router: Router
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
    if (featureToggleService.enabled('tracking') && cookiesService.cookieConsentFor('tracking')) {
      store.pipe(select(getCamfilChannel), whenTruthy(), take(1)).subscribe(camfilChannel => {
        this.gtmToken = this.channelConfs
          .filter(item => item.channel === camfilChannel)
          .map(item => item.gtmContainerId)[0];
      });
    }
  }

  ngOnInit() {
    this.deviceType$ = this.appFacade.deviceType$;
    this.wrapperClasses$ = this.appFacade.appWrapperClasses$;
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
