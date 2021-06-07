import { ModuleWithProviders, NgModule } from '@angular/core';

import { AttributeToStringPipe } from './models/attribute/attribute.pipe';
import { PricePipe } from './models/price/price.pipe';
import { AddressSortPipe } from './pipes/camfil-address-sort.pipe';
import { CamfilDatePipe } from './pipes/camfil-date.pipe';
import { CamfilDimensionPipe } from './pipes/camfil-dimension.pipe';
import { CamfilProductAttributeValPipe } from './pipes/camfil-product-attribute-val';
import { CamfilRemoveWhiteSpacesPipe } from './pipes/camfil-remove-white-space.pipe';
import { DatePipe } from './pipes/date.pipe';
import { FeatureTogglePipe } from './pipes/feature-toggle.pipe';
import { HighlightPipe } from './pipes/highlight.pipe';
import { MakeHrefPipe } from './pipes/make-href.pipe';
import { SanitizePipe } from './pipes/sanitize.pipe';
import { ServerSettingPipe } from './pipes/server-setting.pipe';
import { CategoryRoutePipe } from './routing/category/category-route.pipe';
import { ProductRoutePipe } from './routing/product/product-route.pipe';

const pipes = [
  AddressSortPipe,
  AttributeToStringPipe,
  CamfilDatePipe,
  CamfilDimensionPipe,
  CamfilProductAttributeValPipe,
  CamfilRemoveWhiteSpacesPipe,
  CategoryRoutePipe,
  DatePipe,
  FeatureTogglePipe,
  HighlightPipe,
  MakeHrefPipe,
  PricePipe,
  ProductRoutePipe,
  SanitizePipe,
  ServerSettingPipe,
];

@NgModule({
  declarations: [...pipes],
  exports: [...pipes],
  providers: [CamfilDatePipe, AddressSortPipe],
})
export class PipesModule {
  static forRoot(): ModuleWithProviders<PipesModule> {
    return {
      ngModule: PipesModule,
      providers: [...pipes],
    };
  }
}
