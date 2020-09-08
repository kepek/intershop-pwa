import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

import { AttributeHelper } from 'ish-core/models/attribute/attribute.helper';
import { Attribute } from 'ish-core/models/attribute/attribute.model';
import { Product } from 'ish-core/models/product/product.model';

/**
 * The Product Attribute Component renders the product attribute with a label.
 *
 * @example
 * <camfil-product-attribute
 *   [product]="product"
 *   [label]="ID"
 *   [value]="sku"
 *   [itmProp]="sku">
 * </camfil-product-attribute>
 */

@Component({
  selector: 'camfil-product-attribute',
  templateUrl: './camfil-product-attribute.component.html',
  styleUrls: ['./camfil-product-attribute.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilProductAttributeComponent implements OnInit {
  @Input() value?: string | object;
  @Input() name: string;
  @Input() product: Product;
  @Input() itemProp?: string;
  @Input() multipleValuesSeparator = ', ';

  attribute: Attribute;

  classObject: { [key: string]: boolean };

  ngOnInit() {
    this.classObject = {
      'camfil-product-attribute': true,
      [`camfil-product-attribute--${this.name}`]: !!this.name,
    };

    let attribute = AttributeHelper.getAttributeByAttributeName(this.product?.attributes, this.name);

    if (!attribute && this.name && this.value) {
      attribute = {
        name: this.name,
        value: this.value,
        type: 'String',
      };

      if (this.value && typeof this.value === 'object') {
        attribute = {
          ...attribute,
          ...this.value,
        };
      }
    }

    this.attribute = attribute;
  }
}
