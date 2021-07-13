import { NgModule } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Angulartics2Module } from 'angulartics2';
import { Angulartics2GoogleTagManager } from 'angulartics2/gtm';
import { filter, first } from 'rxjs/operators';

import { FeatureToggleModule, FeatureToggleService } from 'ish-core/feature-toggle.module';
import { setGTMToken } from 'ish-core/store/core/configuration';
import { CookiesService } from 'ish-core/utils/cookies/cookies.service';
import { whenTruthy } from 'ish-core/utils/operators';
import { StatePropertiesService } from 'ish-core/utils/state-transfer/state-properties.service';

import { TrackingStoreModule } from './store/tracking-store.module';

@NgModule({
  imports: [Angulartics2Module.forRoot(), FeatureToggleModule, TrackingStoreModule],
})
export class TrackingModule {
  constructor(
    private featureToggleService: FeatureToggleService,
    private stateProperties: StatePropertiesService,
    private angulartics2GoogleTagManager: Angulartics2GoogleTagManager,
    private cookiesService: CookiesService,
    private router: Router,
    private store: Store
  ) {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        filter(() => this.featureToggleService.enabled('tracking') && this.cookiesService.cookieConsentFor('tracking')),
        first()
      )
      .subscribe(() => {
        this.startTracking();
      });
  }

  private startTracking() {
    this.stateProperties
      .getStateOrEnvOrDefault<string>('GTM_TOKEN', 'gtmToken')
      .pipe(whenTruthy(), first())
      .subscribe(gtmToken => {
        this.store.dispatch(setGTMToken({ gtmToken }));
        console.log('startTracking', gtmToken);
        this.gtm(window, 'dataLayer', gtmToken);
        this.angulartics2GoogleTagManager.startTracking();
      });
  }

  // tslint:disable-next-line: no-any - gtm library access
  private gtm(w: any, l: string, i: string) {
    w[l] = w[l] || [];
    w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
    const gtmScript = document.createElement('script');
    const dl = l !== 'dataLayer' ? '&l=' + l : '';
    gtmScript.async = true;
    gtmScript.src = `https://www.googletagmanager.com/gtm.js?id=${i}${dl}`;
    const f = document.getElementsByTagName('script')[0];
    f.parentNode.insertBefore(gtmScript, f);
  }
}
