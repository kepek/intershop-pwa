import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { VariationOptionGroup } from 'ish-core/models/product-variation/variation-option-group.model';
import { VariationSelection } from 'ish-core/models/product-variation/variation-selection.model';
import {
  ProductView,
  VariationProductMasterView,
  VariationProductView,
} from 'ish-core/models/product-view/product-view.model';
import { ProductHelper, ProductPrices } from 'ish-core/models/product/product.model';
import { CategoryView } from 'ish-core/models/category-view/category-view.model';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { whenTruthy } from 'ish-core/utils/operators';

@Component({
  selector: 'camfil-product-detail',
  templateUrl: './camfil-product-detail.component.html',
  styleUrls: ['./camfil-product-detail.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilProductDetailComponent implements OnInit, OnDestroy {
  @Input() product: ProductView | VariationProductView | VariationProductMasterView;
  @Input() category?: CategoryView;
  @Input() quantity: number;
  @Input() price: ProductPrices;
  @Input() variationOptions: VariationOptionGroup[];
  @Input() isInCompareList: boolean;
  @Output() productToBasket = new EventEmitter<{ sku: string; quantity: number }>();
  @Output() productToCompare = new EventEmitter<string>();
  @Output() selectVariation = new EventEmitter<{ selection: VariationSelection; changedAttribute?: string }>();
  @Output() quantityChange = new EventEmitter<number>();
  @Output() compareToggle = new EventEmitter<void>();

  constructor(private shoppingFacade: ShoppingFacade) {}

  productDetailForm: FormGroup;
  readonly quantityControlName = 'quantity';

  isVariationProduct = ProductHelper.isVariationProduct;
  isMasterProduct = ProductHelper.isMasterProduct;
  isRetailSet = ProductHelper.isRetailSet;

  private destroy$ = new Subject();

  ngOnInit() {
    this.productDetailForm = new FormGroup({
      [this.quantityControlName]: new FormControl(this.quantity || this.product.minOrderQuantity),
    });

    this.productDetailForm
      .get(this.quantityControlName)
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(this.quantityChange);

    if (!this.category && this.product.defaultCategoryId) {
      this.shoppingFacade
        .category$(this.product.defaultCategoryId)
        .pipe(whenTruthy(), takeUntil(this.destroy$))
        .subscribe(category => {
          this.category = category;
        });
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  addToBasket() {
    this.productToBasket.emit({
      sku: this.product.sku,
      quantity: this.productDetailForm.get(this.quantityControlName).value,
    });
  }

  toggleCompare() {
    this.compareToggle.emit();
  }

  addToCompare() {
    this.productToCompare.emit(this.product.sku);
  }

  variationSelected(event: { selection: VariationSelection; changedAttribute?: string }) {
    this.selectVariation.emit(event);
  }
}
