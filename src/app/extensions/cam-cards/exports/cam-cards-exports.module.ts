import { NgModule } from '@angular/core';

import { FeatureToggleModule } from 'ish-core/feature-toggle.module';
import { LAZY_FEATURE_MODULE } from 'ish-core/utils/module-loader/module-loader.service';

import { CamPdfService } from '../../cam-pdf/services/cam-pdf/cam-pdf.service';

import { LazyBasketCreateCamCardComponent } from './lazy-basket-create-cam-card/lazy-basket-create-cam-card.component';
import { LazyCamCardDeliveryIntervalComponent } from './lazy-cam-card-delivery-interval/lazy-cam-card-delivery-interval.component';
import { LazyCamCardLastDeliveryDateComponent } from './lazy-cam-card-last-delivery-date/lazy-cam-card-last-delivery-date.component';
import { LazyProductAddToCamCardComponent } from './lazy-product-add-to-cam-card/lazy-product-add-to-cam-card.component';
import { LazyProductsAddToCamCardComponent } from './lazy-products-add-to-cam-card/lazy-products-add-to-cam-card.component';

@NgModule({
  imports: [FeatureToggleModule],
  providers: [
    {
      provide: LAZY_FEATURE_MODULE,
      useValue: { feature: 'camCards', location: import('../store/cam-cards-store.module') },
      multi: true,
    },
    CamPdfService,
  ],
  declarations: [
    LazyBasketCreateCamCardComponent,
    LazyCamCardDeliveryIntervalComponent,
    LazyCamCardLastDeliveryDateComponent,
    LazyProductAddToCamCardComponent,
    LazyProductsAddToCamCardComponent,
  ],
  exports: [
    LazyBasketCreateCamCardComponent,
    LazyCamCardDeliveryIntervalComponent,
    LazyCamCardLastDeliveryDateComponent,
    LazyProductAddToCamCardComponent,
    LazyProductsAddToCamCardComponent,
  ],
})
export class CamCardsExportsModule {}
