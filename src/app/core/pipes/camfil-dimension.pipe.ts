import { formatNumber } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { AttributeGroupTypes } from 'ish-core/models/attribute-group/attribute-group.types';
import { Attribute } from 'ish-core/models/attribute/attribute.model';
import { Product, ProductHelper } from 'ish-core/models/product/product.model';

@Pipe({ name: 'camfilDimension', pure: true })
export class CamfilDimensionPipe implements PipeTransform {
  constructor(private translateService: TranslateService) {}

  transform(product: Product, valuesSeparator: string = 'x'): string {
    // w-h-d

    const attributes =
      ProductHelper.getAttributesOfGroup(product, AttributeGroupTypes.ProductsListLabelAttributes) ||
      product.attributes;

    const names = ['width', 'height', 'depth'];
    return attributes
      .filter(attribute => names.indexOf(attribute?.name?.toLowerCase()) !== -1)
      .map(attribute => {
        const data = attribute as Attribute<{ value: unknown }>;
        const val = (data.value?.value || data.value) as number;
        return {
          index: names.indexOf(attribute?.name?.toLowerCase()),
          value: formatNumber(val, this.translateService.currentLang),
        };
      })
      .sort((a, b) => {
        if (a.index > b.index) {
          return 1;
        }
        if (a.index < b.index) {
          return -1;
        }
        return 0;
      })
      .map(elem => elem.value)
      .join(valuesSeparator);
  }
}
