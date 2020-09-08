import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { Product } from 'ish-core/models/product/product.model';

@Component({
  selector: 'camfil-product-inventory',
  templateUrl: './camfil-product-inventory.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilProductInventoryComponent {
  @Input() product: Product;
}
