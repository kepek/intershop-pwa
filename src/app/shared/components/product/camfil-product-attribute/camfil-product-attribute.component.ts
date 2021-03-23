import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import { Attribute } from 'ish-core/models/attribute/attribute.model';

/**
 * The Product Attribute Component renders the product attribute with a label.
 *
 * @example
 * <camfil-product-attribute
 *   [name]="ID"
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
  // tslint:disable-next-line:no-any
  @Input() value?: any;
  @Input() name: string;
  @Input() identifier?: string;
  @Input() itemProp?: string;
  @Input() multipleValuesSeparator = ', ';

  attribute: Attribute;

  classObject: { [key: string]: boolean };

  constructor(private translateService: TranslateService) {}

  ngOnInit() {
    this.classObject = {
      'camfil-product-attribute': true,
      [`camfil-product-attribute--${this.identifier}`]: !!this.identifier,
      [`camfil-product-attribute--${this.translateService.instant(this.name)}`]: !!this.name,
    };

    this.attribute = {
      name: this.name,
      value: this.value,
      type: 'String',
    };
  }
}
