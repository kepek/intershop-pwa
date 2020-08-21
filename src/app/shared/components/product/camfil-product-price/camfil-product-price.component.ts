import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';

import { Price, PriceHelper } from 'ish-core/models/price/price.model';
import { AnyProductType, Product } from 'ish-core/models/product/product.model';

@Component({
  selector: 'camfil-product-price',
  templateUrl: './camfil-product-price.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilProductPriceComponent implements OnChanges {
  @Input() product: AnyProductType;
  @Input() showInformationalPrice: boolean;
  @Input() showPriceSavings: boolean;

  isListPriceGreaterThanSalePrice = false;
  isListPriceLessThanSalePrice = false;
  priceSavings: Price;

  ngOnChanges() {
    this.applyPriceParameters(this.product);
  }

  private applyPriceParameters(product: Product) {
    if (product.listPrice && product.salePrice) {
      this.isListPriceGreaterThanSalePrice = product.listPrice.value > product.salePrice.value;
      this.isListPriceLessThanSalePrice = product.listPrice.value < product.salePrice.value;
      if (this.showPriceSavings) {
        this.priceSavings = PriceHelper.diff(product.listPrice, product.salePrice);
      }
    }
  }

  get upperPrice() {
    return this.product.summedUpSalePrice || this.product.maxSalePrice;
  }

  get isPriceRange() {
    return this.product.minSalePrice && this.upperPrice;
  }
}
