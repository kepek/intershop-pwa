import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

import { Product } from 'ish-core/models/product/product.model';

/**
 * The Product ID Component renders the product id with a label.
 *
 * @example
 * <camfil-product-id [product]="product"></camfil-product-id>
 */
@Component({
  selector: 'camfil-product-id',
  templateUrl: './camfil-product-id.component.html',
  styleUrls: ['../camfil-product-attribute/camfil-product-attribute.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilProductIdComponent implements OnInit {
  @Input() label = 'camfil.product.id.label';
  @Input() product: Product;

  classObject: { [key: string]: boolean };

  ngOnInit() {
    this.classObject = {
      'camfil-product-attribute camfil-product-id': true,
    };
  }
}
