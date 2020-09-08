import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';
import { Observable } from 'rxjs';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { Product } from 'ish-core/models/product/product.model';
import { Promotion } from 'ish-core/models/promotion/promotion.model';

@Component({
  selector: 'camfil-product-promotion',
  templateUrl: './camfil-product-promotion.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilProductPromotionComponent implements OnChanges {
  @Input() product: Product;
  @Input() displayType?: 'simpleWithDetail' | 'simple' = 'simple';

  promotions$: Observable<Promotion[]>;

  constructor(private shoppingFacade: ShoppingFacade) {}

  ngOnChanges() {
    if (this.product && this.product.promotionIds) {
      this.promotions$ = this.shoppingFacade.promotions$(this.product.promotionIds);
    }
  }
}
