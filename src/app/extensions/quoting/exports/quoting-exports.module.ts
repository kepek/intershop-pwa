import { NgModule } from '@angular/core';

import { FeatureToggleModule } from 'ish-core/feature-toggle.module';
import { LAZY_FEATURE_MODULE } from 'ish-core/utils/module-loader/module-loader.service';

import { LazyQuoteWidgetComponent } from './account/lazy-quote-widget/lazy-quote-widget.component';
import { LazyBasketAddToQuoteComponent } from './basket/lazy-basket-add-to-quote/lazy-basket-add-to-quote.component';
import { LazyProductAddToQuoteComponent } from './product/lazy-product-add-to-quote/lazy-product-add-to-quote.component';

@NgModule({
  imports: [FeatureToggleModule],
  providers: [
    {
      provide: LAZY_FEATURE_MODULE,
      useValue: { feature: 'quoting', location: import('../store/quoting-store.module') },
      multi: true,
    },
  ],
  declarations: [LazyBasketAddToQuoteComponent, LazyProductAddToQuoteComponent, LazyQuoteWidgetComponent],
  exports: [LazyBasketAddToQuoteComponent, LazyProductAddToQuoteComponent, LazyQuoteWidgetComponent],
})
export class QuotingExportsModule {}
