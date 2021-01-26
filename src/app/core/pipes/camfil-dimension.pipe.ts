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
    // w-d-h

    const attributes =
      ProductHelper.getAttributesOfGroup(product, AttributeGroupTypes.ProductsListLabelAttributes) ||
      product.attributes;

    const names = ['width', 'depth', 'height'];
    const dimensions = attributes
      .filter(attribute => names.indexOf(attribute?.name?.toLowerCase()) !== -1)
      .map(attribute => {
        const data = attribute as Attribute<{ value: unknown }>;
        const val = (data.value?.value || data.value) as number;
        return formatNumber(val, this.translateService.currentLang);
      });

    return (dimensions.length === 3 ? dimensions : []).join(valuesSeparator);
  }
}
