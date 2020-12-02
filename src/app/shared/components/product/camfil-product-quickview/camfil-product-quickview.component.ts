import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { Product } from 'ish-core/models/product/product.model';

@Component({
  selector: 'camfil-product-quickview',
  templateUrl: './camfil-product-quickview.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilProductQuickviewComponent {
  @Input() product: Product;
  @Input() hideText = false;
}
