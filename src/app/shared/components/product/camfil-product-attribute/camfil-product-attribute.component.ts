import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Memoize } from 'typescript-memoize';

import { Attribute } from 'ish-core/models/attribute/attribute.model';

/**
 * The Product Attribute Component renders the product attribute with a label.
 *
 * @example
 * <camfil-product-attribute
 *   [name]="ID"
 *   [value]="sku"
 *   [itmProp]="sku">
 * </camfil-product-attribute>`
 */

@Component({
  selector: 'camfil-product-attribute',
  templateUrl: './camfil-product-attribute.component.html',
  styleUrls: ['./camfil-product-attribute.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilProductAttributeComponent {
  // tslint:disable-next-line:no-any
  @Input() value?: any;
  @Input() name: string;
  @Input() identifier?: string;
  @Input() itemProp?: string;
  @Input() multipleValuesSeparator = ', ';
  @Input() hideAttributeName = false;
  @Input() overflowVisible = false;

  @Memoize({ tags: ['attribute'] })
  get attribute(): Attribute {
    return {
      name: this.name,
      value: this.value,
      type: typeof this.value === 'number' ? 'Integer' : 'String',
    };
  }

  @Memoize({ tags: ['classObject'] })
  get classObject(): { [key: string]: boolean } {
    return {
      'camfil-product-attribute': true,
      [`camfil-product-attribute--${this.identifier}`]: !!this.identifier,
    };
  }
}
