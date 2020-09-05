import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';

import { Product } from 'ish-core/models/product/product.model';

@Component({
  selector: 'camfil-product-shipment',
  templateUrl: './camfil-product-shipment.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilProductShipmentComponent implements OnChanges {
  @Input() product: Product;

  isShipmentInformationAvailable = false;

  ngOnChanges() {
    this.isShipmentInformationAvailable =
      Number.isInteger(this.product.readyForShipmentMin) && Number.isInteger(this.product.readyForShipmentMax);
  }
}
