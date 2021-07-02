import { NgModule } from '@angular/core';
import { Actions, createEffect } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { Angulartics2Module } from 'angulartics2';
import { Angulartics2GoogleTagManager } from 'angulartics2/gtm';
import { iif } from 'rxjs';
import { filter, map, take, takeWhile, withLatestFrom } from 'rxjs/operators';

import { FeatureToggleModule, FeatureToggleService } from 'ish-core/feature-toggle.module';
import { getGTMToken, setGTMToken } from 'ish-core/store/core/configuration';
import { CookiesService } from 'ish-core/utils/cookies/cookies.service';
import { whenTruthy } from 'ish-core/utils/operators';
import { StatePropertiesService } from 'ish-core/utils/state-transfer/state-properties.service';

@NgModule({
  imports: [Angulartics2Module.forRoot(), FeatureToggleModule],
})
export class TrackingModule {
  constructor(
    private actions$: Actions,
    private featureToggleService: FeatureToggleService,
    private stateProperties: StatePropertiesService,
    angulartics2GoogleTagManager: Angulartics2GoogleTagManager,
    store: Store,
    private cookiesService: CookiesService
  ) {
    if (cookiesService.cookieConsentFor('tracking')) {
      store
        .pipe(
          select(getGTMToken),
          filter(gtmToken => gtmToken && featureToggleService.enabled('tracking')),
          take(1)
        )
        .subscribe(gtmToken => {
          this.gtm(window, 'dataLayer', gtmToken);
          angulartics2GoogleTagManager.startTracking();
        });
    }
  }

  setGTMToken$ = createEffect(
    () =>
      iif(
        () => this.cookiesService.cookieConsentFor('tracking'),
        this.actions$.pipe(
          takeWhile(() => this.featureToggleService.enabled('tracking')),
          take(1),
          withLatestFrom(this.stateProperties.getStateOrEnvOrDefault<string>('GTM_TOKEN', 'gtmToken')),
          map(([, gtmToken]) => gtmToken),
          whenTruthy(),
          map(gtmToken => setGTMToken({ gtmToken }))
        )
      ),
    { dispatch: false }
  );
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
