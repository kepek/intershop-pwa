import { ModuleWithProviders, NgModule } from '@angular/core';

import { AttributeToStringPipe } from './models/attribute/attribute.pipe';
import { PricePipe } from './models/price/price.pipe';
import { CamfilDatePipe } from './pipes/camfil-date.pipe';
import { CamfilDimensionPipe } from './pipes/camfil-dimension.pipe';
import { DatePipe } from './pipes/date.pipe';
import { HighlightPipe } from './pipes/highlight.pipe';
import { MakeHrefPipe } from './pipes/make-href.pipe';
import { SanitizePipe } from './pipes/sanitize.pipe';
import { CategoryRoutePipe } from './routing/category/category-route.pipe';
import { ProductRoutePipe } from './routing/product/product-route.pipe';

const pipes = [
  AttributeToStringPipe,
  CamfilDatePipe,
  CamfilDimensionPipe,
  CategoryRoutePipe,
  DatePipe,
  HighlightPipe,
  MakeHrefPipe,
  PricePipe,
  ProductRoutePipe,
  SanitizePipe,
];

@NgModule({
  declarations: [...pipes],
  exports: [...pipes],
  providers: [CamfilDatePipe],
})
export class PipesModule {
  static forRoot(): ModuleWithProviders<PipesModule> {
    return {
      ngModule: PipesModule,
      providers: [...pipes],
    };
  }
}
