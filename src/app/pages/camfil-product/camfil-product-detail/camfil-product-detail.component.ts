import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { startWith, take, takeUntil } from 'rxjs/operators';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { CategoryView } from 'ish-core/models/category-view/category-view.model';
import { VariationOptionGroup } from 'ish-core/models/product-variation/variation-option-group.model';
import { VariationSelection } from 'ish-core/models/product-variation/variation-selection.model';
import {
  ProductView,
  VariationProductMasterView,
  VariationProductView,
} from 'ish-core/models/product-view/product-view.model';
import { ProductHelper, ProductPrices } from 'ish-core/models/product/product.model';
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
  @Output() productToBasket = new EventEmitter<{ sku: string; quantity: number }>();
  @Output() productToCompare = new EventEmitter<string>();
  @Output() selectVariation = new EventEmitter<{ selection: VariationSelection; changedAttribute?: string }>();
  @Output() quantityChange = new EventEmitter<number>();
  @Output() compareToggle = new EventEmitter<void>();
  @Input() productSku: string;
  @Output() productSkuChange = new EventEmitter<string>();

  userPermissions$: Observable<string[]>;
  isInCompareList$: Observable<boolean>;
  isInCompareList: boolean;
  showAddToCompare = false;
  private sku$ = new ReplaySubject<string>(1);

  constructor(private shoppingFacade: ShoppingFacade, private accountFacade: AccountFacade) {}

  productDetailForm: FormGroup;
  readonly quantityControlName = 'quantity';

  isVariationProduct = ProductHelper.isVariationProduct;
  isMasterProduct = ProductHelper.isMasterProduct;
  isRetailSet = ProductHelper.isRetailSet;
  getImageCdnUrl = ProductHelper.getImageCdnUrl;

  private destroy$ = new Subject();

  ngOnInit() {
    this.productDetailForm = new FormGroup({
      [this.quantityControlName]: new FormControl(),
    });

    this.productDetailForm
      .get(this.quantityControlName)
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(this.quantityChange);

    if (!this.category && this.product?.defaultCategoryId) {
      this.shoppingFacade
        .category$(this.product.defaultCategoryId)
        .pipe(whenTruthy(), takeUntil(this.destroy$))
        .subscribe(category => {
          // tslint:disable-next-line:no-assignement-to-inputs
          this.category = category;
        });
    }

    this.productSkuChange.pipe(startWith(this.productSku), takeUntil(this.destroy$)).subscribe(this.sku$);
    if (this.product?.sku) {
      this.isInCompareList$ = this.shoppingFacade.inCompareProducts$(this.product.sku);
      this.isInCompareList$.pipe(take(1), takeUntil(this.destroy$)).subscribe(isInCompare => {
        this.isInCompareList = isInCompare;
      });
    }

    this.userPermissions$ = this.accountFacade.userPermissions$.pipe(takeUntil(this.destroy$));
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
    this.isInCompareList = !this.isInCompareList;
    this.sku$.pipe(take(1), takeUntil(this.destroy$)).subscribe(sku => this.shoppingFacade.toggleProductCompare(sku));
  }

  addToCompare() {
    this.productToCompare.emit(this.product.sku);
  }

  variationSelected(event: { selection: VariationSelection; changedAttribute?: string }) {
    this.selectVariation.emit(event);
  }
}
