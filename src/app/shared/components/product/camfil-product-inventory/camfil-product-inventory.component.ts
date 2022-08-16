import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { Product, ProductCompletenessLevel, ProductHelper } from 'ish-core/models/product/product.model';

@Component({
  selector: 'camfil-product-inventory',
  templateUrl: './camfil-product-inventory.component.html',
  styleUrls: ['./camfil-product-inventory.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilProductInventoryComponent implements OnInit, OnDestroy {
  constructor(private shoppingFacade: ShoppingFacade) {}

  private static REQUIRED_COMPLETENESS_LEVEL = ProductCompletenessLevel.List;
  @Input() product: Product | Pick<Product, 'sku'>;
  @Input() showText?: boolean;
  showAvailabilityDot = ProductHelper.showAvailabilityDot;
  isAvailabilityDotVisible: boolean;

  private destroy$ = new Subject<void>();

  ngOnInit() {
    this.shoppingFacade
      .product$(this.product.sku, CamfilProductInventoryComponent.REQUIRED_COMPLETENESS_LEVEL)
      .pipe(take(1), takeUntil(this.destroy$))
      .subscribe((res: Product) => (this.isAvailabilityDotVisible = this.showAvailabilityDot(res)));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
