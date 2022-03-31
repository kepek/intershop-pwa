import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  TemplateRef,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { CamCardsFacade } from 'src/app/extensions/cam-cards/facades/cam-cards.facade';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { CategoryView } from 'ish-core/models/category-view/category-view.model';
import { VariationOptionGroup } from 'ish-core/models/product-variation/variation-option-group.model';
import { VariationSelection } from 'ish-core/models/product-variation/variation-selection.model';
import {
  ProductView,
  VariationProductMasterView,
  VariationProductView,
} from 'ish-core/models/product-view/product-view.model';
import { ProductHelper } from 'ish-core/models/product/product.helper';
import { ProductItemDetailedComponentConfiguration } from 'ish-shared/components/product/camfil-product-item-detailed/camfil-product-item-detailed.component';

export interface ProductItemBaseComponentConfiguration {
  readOnly: boolean;
  allowZeroQuantity: boolean;
  quantityLabel: string;
  displayName: boolean;
  displayDescription: boolean;
  displaySKU: boolean;
  displayInventory: boolean;
  displayPrice: boolean;
  displayPromotions: boolean;
  displayQuantity: boolean;
  displayVariations: boolean;
  displayShipment: boolean;
  displayAddToBasket: boolean;
  displayAddToWishlist: boolean;
  displayAddToOrderTemplate: boolean;
  displayAddToCamCard: boolean;
  displayAddToCompare: boolean;
  displayAddToQuote: boolean;
  displayActionTemplate: boolean;
}

@Component({
  selector: 'camfil-product-item-base',
  templateUrl: './camfil-product-item-base.component.html',
  styleUrls: ['./camfil-product-item-base.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilProductItemBaseComponent implements OnInit, OnDestroy {
  @Input() configuration: Partial<ProductItemDetailedComponentConfiguration> = {};
  @Input() product: ProductView | VariationProductView | VariationProductMasterView;
  @Input() category?: CategoryView;
  @Input() quantity: number;
  @Output() quantityChange = new EventEmitter<number>();
  @Input() variationOptions: VariationOptionGroup[];
  @Input() isInCompareList: boolean;
  @Output() compareToggle = new EventEmitter<void>();
  @Output() productToBasket = new EventEmitter<number>();
  @Output() selectVariation = new EventEmitter<{ selection: VariationSelection; changedAttribute?: string }>();
  @Input() isMobileView: boolean;
  @Input() hideAttributeName?: boolean;
  @Input() actionTemplate?: TemplateRef<unknown>;
  @Output() resetQuantityValue = new EventEmitter<FormGroup>();
  @Input() categoryFilterParams?: string;

  isLoggedIn: boolean;
  isMasterProduct = ProductHelper.isMasterProduct;
  updatedQuantity: number;
  productItemForm: FormGroup;

  readonly quantityControlName = 'quantity';

  // tslint:disable-next-line: private-destroy-field
  protected destroy$ = new Subject();

  constructor(private camCardsFacade: CamCardsFacade, private accountFacade: AccountFacade) {}

  ngOnInit() {
    this.updatedQuantity = this.quantity || 0;

    this.productItemForm = new FormGroup({
      [this.quantityControlName]: new FormControl(this.updatedQuantity, { updateOn: 'blur' }),
    });
    this.productItemForm
      .get(this.quantityControlName)
      .valueChanges.pipe(
        map(val => +val),
        takeUntil(this.destroy$)
      )
      .subscribe(quantity => {
        this.updatedQuantity = quantity;
        this.quantityChange.emit(quantity);
      });

    this.camCardsFacade.getAddProductSuccess$.pipe(takeUntil(this.destroy$)).subscribe(value => {
      if (value) {
        this.resetFormValues();
      }
    });
    this.accountFacade.isLoggedIn$.pipe(takeUntil(this.destroy$)).subscribe(value => {
      this.isLoggedIn = value;
    });
  }

  addToBasket() {
    this.productToBasket.emit(this.productItemForm.get(this.quantityControlName).value);
  }

  toggleCompare() {
    this.compareToggle.emit();
  }

  variationSelected(event: { selection: VariationSelection; changedAttribute?: string }) {
    if (ProductHelper.isVariationProduct(this.product)) {
      this.selectVariation.emit(event);
    }
  }

  resetFormValues() {
    this.resetQuantityValue.emit(this.productItemForm);
  }

  getCategoryFilterParams(uniqueId) {
    const category = '&category=' + uniqueId?.split('.').join('/');
    const productFilter = '&productFilter=fallback_searchquerydefinition';

    if (!category || !this.categoryFilterParams) {
      return {};
    } else {
      return { filters: this.categoryFilterParams + productFilter + category };
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
