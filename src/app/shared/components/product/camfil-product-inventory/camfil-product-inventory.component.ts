import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';

import { Product, ProductHelper } from 'ish-core/models/product/product.model';

@Component({
  selector: 'camfil-product-inventory',
  templateUrl: './camfil-product-inventory.component.html',
  styleUrls: ['./camfil-product-inventory.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilProductInventoryComponent implements OnChanges {
  @Input() product: Product;
  @Input() showText?: boolean;
  isAvailabilityDotVisible: boolean;

  ngOnChanges() {
    this.isAvailabilityDotVisible = ProductHelper.showAvailabilityDot(this.product);
  }
}
