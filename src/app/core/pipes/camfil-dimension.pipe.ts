import { Pipe, PipeTransform } from '@angular/core';

import { AttributeToStringPipe } from 'ish-core/models/attribute/attribute.pipe';
import { Product } from 'ish-core/models/product/product.model';

@Pipe({ name: 'camfilDimension', pure: true })
export class CamfilDimensionPipe implements PipeTransform {
  constructor(private attributeToStringPipe: AttributeToStringPipe) {}

  transform(attributes: PropType<Product, 'attributes'>, valuesSeparator: string = '-'): string {
    // w-d-h
    const names = ['width', 'depth', 'height'];

    const dimensions = attributes
      .filter(attribute => names.indexOf(attribute.name.toLowerCase()) !== -1)
      .map(attribute => this.attributeToStringPipe.transform(attribute, ','));

    return (dimensions.length === 3 ? dimensions : ['xxx', 'xxx', 'xxx']).join(valuesSeparator);
  }
}
