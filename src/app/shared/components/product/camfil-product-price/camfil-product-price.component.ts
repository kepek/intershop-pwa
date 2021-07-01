import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { ProductPriceComponent } from 'ish-shared/components/product/product-price/product-price.component';

@Component({
  selector: 'camfil-product-price',
  templateUrl: './camfil-product-price.component.html',
  styleUrls: ['./camfil-product-price.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilProductPriceComponent extends ProductPriceComponent {
  @Input() showInformationalPrice = true;
  @Input() showPriceSavings = false;
}
