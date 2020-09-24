import { NgModule } from '@angular/core';

import { FeatureToggleModule } from 'ish-core/feature-toggle.module';
import { LAZY_FEATURE_MODULE } from 'ish-core/utils/module-loader/module-loader.service';

import { LazyBasketCreateCamCardComponent } from './lazy-basket-create-cam-card/lazy-basket-create-cam-card.component';
import { LazyProductAddToCamCardComponent } from './lazy-product-add-to-cam-card/lazy-product-add-to-cam-card.component';

@NgModule({
  imports: [FeatureToggleModule],
  providers: [
    {
      provide: LAZY_FEATURE_MODULE,
      useValue: { feature: 'camCards', location: import('../store/cam-cards-store.module') },
      multi: true,
    },
  ],
  declarations: [LazyBasketCreateCamCardComponent, LazyProductAddToCamCardComponent],
  exports: [LazyBasketCreateCamCardComponent, LazyProductAddToCamCardComponent],
})
export class CamCardsExportsModule {}
