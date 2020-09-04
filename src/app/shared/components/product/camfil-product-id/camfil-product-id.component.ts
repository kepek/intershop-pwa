import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilProductIdComponent {
  /**
   * The product for which the ID should be displayed.
   */
  @Input() product: Product;
}
