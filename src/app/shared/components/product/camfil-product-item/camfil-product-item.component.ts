import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { filter, startWith, take, takeUntil } from 'rxjs/operators';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { Category } from 'ish-core/models/category/category.model';
import { ProductVariationHelper } from 'ish-core/models/product-variation/product-variation.helper';
import { VariationOptionGroup } from 'ish-core/models/product-variation/variation-option-group.model';
import { VariationSelection } from 'ish-core/models/product-variation/variation-selection.model';
import { ProductView, VariationProductView } from 'ish-core/models/product-view/product-view.model';
import { ProductCompletenessLevel, ProductHelper } from 'ish-core/models/product/product.model';
import { ViewType } from 'ish-core/models/viewtype/viewtype.types';
import { ProductItemDetailedComponentConfiguration } from 'ish-shared/components/product/camfil-product-item-detailed/camfil-product-item-detailed.component';
import { ProductItemSimpleComponentConfiguration } from 'ish-shared/components/product/camfil-product-item-simple/camfil-product-item-simple.component';

export type ProductItemContainerConfiguration = ProductItemSimpleComponentConfiguration &
  ProductItemDetailedComponentConfiguration & { displayType: ViewType };

export const DEFAULT_CONFIGURATION: Readonly<ProductItemContainerConfiguration> = {
  readOnly: false,
  allowZeroQuantity: false,
  quantityLabel: ' ',
  displayName: true,
  displayDescription: true,
  displaySKU: true,
  displayInventory: true,
  displayQuantity: true,
  displayPrice: true,
  displayPromotions: true,
  displayVariations: true,
  displayShipment: false,
  displayAddToBasket: true,
  displayAddToWishlist: true,
  displayAddToOrderTemplate: true,
  displayAddToCamCard: true,
  displayAddToCompare: true,
  displayAddToQuote: true,
  displayType: 'simple',
};

/**
 * The Product Item Container Component fetches the product data for a given product sku
 * and renders the product either as 'simple' or 'detailed'.
 * The 'simple' rendering is the default if no value is provided for the displayType.
 *
 * @example
 * <camfil-product-item [productSku]="product.sku"></camfil-product-item>
 */
@Component({
  selector: 'camfil-product-item',
  templateUrl: './camfil-product-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilProductItemComponent implements OnInit, OnChanges, OnDestroy {
  private static REQUIRED_COMPLETENESS_LEVEL = ProductCompletenessLevel.List;
  /**
   * The Product SKU to render a product item for.
   */
  @Input() productSku: string;
  @Output() productSkuChange = new EventEmitter<string>();
  /**
   * The quantity which should be set for this. Default is minOrderQuantity.
   */
  @Input() quantity: number;
  @Output() quantityChange = new EventEmitter<number>();
  /**
   * The optional Category context.
   */
  @Input() category?: Category;
  /**
   * configuration
   */
  @Input() configuration: ProductItemContainerConfiguration = DEFAULT_CONFIGURATION;

  product$: Observable<ProductView>;
  loading$: Observable<boolean>;
  productVariationOptions$: Observable<VariationOptionGroup[]>;
  isInCompareList$: Observable<boolean>;

  private sku$ = new ReplaySubject<string>(1);
  private destroy$ = new Subject();

  constructor(private shoppingFacade: ShoppingFacade) {}

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit() {
    this.productSkuChange.pipe(startWith(this.productSku), takeUntil(this.destroy$)).subscribe(this.sku$);

    this.product$ = this.shoppingFacade.product$(this.sku$, CamfilProductItemComponent.REQUIRED_COMPLETENESS_LEVEL);

    this.loading$ = this.shoppingFacade.productNotReady$(
      this.sku$,
      CamfilProductItemComponent.REQUIRED_COMPLETENESS_LEVEL
    );

    this.productVariationOptions$ = this.shoppingFacade.productVariationOptions$(this.sku$);

    this.isInCompareList$ = this.shoppingFacade.inCompareProducts$(this.sku$);
  }

  ngOnChanges(changes: SimpleChanges) {
    this.mergeConfiguration(changes);
  }

  private mergeConfiguration(changes: SimpleChanges) {
    if (changes.configuration && changes.configuration.firstChange) {
      const oldConfig = this.configuration || {};
      // tslint:disable-next-line:no-assignement-to-inputs
      this.configuration = { ...DEFAULT_CONFIGURATION, ...oldConfig };
    }
  }

  toggleCompare() {
    this.sku$.pipe(take(1), takeUntil(this.destroy$)).subscribe(sku => this.shoppingFacade.toggleProductCompare(sku));
  }

  addToBasket(quantity: number) {
    this.sku$
      .pipe(take(1), takeUntil(this.destroy$))
      .subscribe(sku => this.shoppingFacade.addProductToBasket(sku, quantity));
  }

  replaceVariation(event: { selection: VariationSelection; changedAttribute?: string }) {
    this.product$
      .pipe(
        take(1),
        filter<VariationProductView>(product => ProductHelper.isVariationProduct(product)),
        takeUntil(this.destroy$)
      )
      .subscribe(product => {
        const { sku } = ProductVariationHelper.findPossibleVariationForSelection(
          event.selection,
          product,
          event.changedAttribute
        );
        this.productSkuChange.emit(sku);
      });
  }

  get isSimpleView() {
    return !!this.configuration && this.configuration.displayType === 'simple';
  }

  get isDetailedView() {
    return !!this.configuration && this.configuration.displayType === 'detailed';
  }
}
