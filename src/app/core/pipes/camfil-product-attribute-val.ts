import { Pipe, PipeTransform } from '@angular/core';

import { AttributeGroupTypes } from 'ish-core/models/attribute-group/attribute-group.types';
import { AttributeHelper } from 'ish-core/models/attribute/attribute.helper';
import { Product, ProductHelper } from 'ish-core/models/product/product.model';
import {Memoize} from "typescript-memoize";

@Pipe({ name: 'camfilProductAttributeVal', pure: true })
export class CamfilProductAttributeValPipe implements PipeTransform {
  @Memoize()
  transform(product: Product, attrName: string): string {
    const attributes =
      ProductHelper.getAttributesOfGroup(product, AttributeGroupTypes.ProductsListLabelAttributes) ||
      product.attributes;
    return AttributeHelper.getAttributeValueByAttributeName(attributes, attrName);
  }
}
