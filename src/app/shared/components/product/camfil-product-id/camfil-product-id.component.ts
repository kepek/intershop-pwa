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
  @Input() label = 'camfil.product.id.label';
  @Input() product: Product;
}
