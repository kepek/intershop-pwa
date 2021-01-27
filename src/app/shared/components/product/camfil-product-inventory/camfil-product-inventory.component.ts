import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { Product } from 'ish-core/models/product/product.model';

@Component({
  selector: 'camfil-product-inventory',
  templateUrl: './camfil-product-inventory.component.html',
  styleUrls: ['./camfil-product-inventory.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilProductInventoryComponent {
  @Input() product: Product;
  @Input() showText?: Product;
}
