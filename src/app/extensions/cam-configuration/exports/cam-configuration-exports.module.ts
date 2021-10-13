import { NgModule } from '@angular/core';

import { FeatureToggleModule } from 'ish-core/feature-toggle.module';
import { LAZY_FEATURE_MODULE } from 'ish-core/utils/module-loader/module-loader.service';

import { ChannelToggleDirective } from '../directives/channel-toggle.directive';

@NgModule({
  imports: [FeatureToggleModule],
  providers: [
    {
      provide: LAZY_FEATURE_MODULE,
      useValue: { feature: 'camConfiguration', location: import('../store/cam-configuration-store.module') },
      multi: true,
    },
  ],
  declarations: [ChannelToggleDirective],
  exports: [ChannelToggleDirective],
})
export class CamConfigurationExportsModule {}
