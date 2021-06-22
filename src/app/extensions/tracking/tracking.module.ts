import { Inject, NgModule } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Angulartics2Module } from 'angulartics2';
import { Angulartics2GoogleTagManager } from 'angulartics2/gtm';
import { take } from 'rxjs/operators';

import { CHANNEL_CONFIGURATION } from 'ish-core/configurations/injection-keys';
import { FeatureToggleModule, FeatureToggleService } from 'ish-core/feature-toggle.module';
import { ChannelConfiguration } from 'ish-core/models/channel-configuration/channel-configuration.model';
import { getChannel } from 'ish-core/store/core/configuration';
import { CookiesService } from 'ish-core/utils/cookies/cookies.service';
import { whenTruthy } from 'ish-core/utils/operators';

@NgModule({
  imports: [Angulartics2Module.forRoot(), FeatureToggleModule],
})
export class TrackingModule {
  private gtm(w, l: string, i: string) {
    w[l] = w[l] || [];
    w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
    const f = document.getElementsByTagName('script')[0];
    const gtmScript = document.createElement('script');
    const dl = l !== 'dataLayer' ? '&l=' + l : '';
    gtmScript.async = true;
    gtmScript.src = `https://www.googletagmanager.com/gtm.js?id=${i}${dl}`;
    f.parentNode.insertBefore(gtmScript, f);
  }

  constructor(
    angulartics2GoogleTagManager: Angulartics2GoogleTagManager,
    featureToggleService: FeatureToggleService,
    store: Store,
    cookiesService: CookiesService,
    @Inject(CHANNEL_CONFIGURATION) public channelConfs: ChannelConfiguration[]
  ) {
    if (cookiesService.cookieConsentFor('tracking')) {
      store.pipe(select(getChannel), whenTruthy(), take(1)).subscribe(channel => {
        const gtmToken = this.channelConfs.filter(item => item.channel === channel).map(item => item.gtmContainerId);
        if (gtmToken.length > 0 && featureToggleService.enabled('tracking')) {
          this.gtm(window, 'dataLayer', gtmToken[0]);
          angulartics2GoogleTagManager.startTracking();
        }
      });
    }
  }
}
