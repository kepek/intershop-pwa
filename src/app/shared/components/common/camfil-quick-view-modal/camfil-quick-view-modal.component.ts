import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Attributes } from '@fortawesome/fontawesome-svg-core';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { VariationOptionGroup } from 'ish-core/models/product-variation/variation-option-group.model';
import {
  ProductView,
  VariationProductMasterView,
  VariationProductView,
} from 'ish-core/models/product-view/product-view.model';
import {
  ProductCompletenessLevel,
  ProductHelper,
  ProductPrices,
  SkuQuantityType,
} from 'ish-core/models/product/product.model';
import { GenerateLazyComponent } from 'ish-core/utils/module-loader/generate-lazy-component.decorator';
import { whenTruthy } from 'ish-core/utils/operators';

// tslint:disable-next-line: project-structure
interface QuickViewModalData {
  sku: string;
}

@Component({
  selector: 'camfil-quick-view-modal',
  templateUrl: './camfil-quick-view-modal.component.html',
  styleUrls: ['./camfil-quick-view-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
/**
 * The Product Add To Cam Card Component adds a product to a cam_cards.
 *
 * @example
 * <camfil-quick-view-modal
 *               [product]=product
 *               class="my-class"
 * ></camfil-quick-view-modal>
 */
@GenerateLazyComponent()
export class CamfilQuickViewModalComponent implements OnInit {
  constructor(
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: QuickViewModalData,
    // private featureToggleService: FeatureToggleService,
    private shoppingFacade: ShoppingFacade
  ) {}

  product$: Observable<ProductView | VariationProductView | VariationProductMasterView>;
  productVariationOptions$: Observable<VariationOptionGroup[]>;
  productLoading$: Observable<boolean>;
  quantity: number;
  price$: Observable<ProductPrices>;
  private destroy$ = new Subject();
  retailSetParts$ = new ReplaySubject<SkuQuantityType[]>(1);
  isInCompareList: boolean;
  multipleValuesSeparator = ', ';
  productDetailForm: FormGroup;
  isShipmentInformationAvailable = false;
  readonly quantityControlName = 'quantity';
  videoUrl: string;
  isProductBundle = ProductHelper.isProductBundle;
  isRetailSet = ProductHelper.isRetailSet;
  isMasterProduct = ProductHelper.isMasterProduct;
  getImageViewIDs = ProductHelper.getImageViewIDs;

  ngOnInit(): void {
    this.product$ = this.shoppingFacade.product$(this.data.sku, ProductCompletenessLevel.Detail);
    // this.productVariationOptions$ = this.shoppingFacade.selectedProductVariationOptions$;

    // this.productLoading$ = this.shoppingFacade.productDetailLoading$;

    this.product$.pipe(whenTruthy(), takeUntil(this.destroy$)).subscribe(product => {
      this.quantity = product.minOrderQuantity;

      this.productDetailForm = new FormGroup({
        [this.quantityControlName]: new FormControl(this.quantity || product.minOrderQuantity),
      });

      this.isShipmentInformationAvailable =
        Number.isInteger(product.readyForShipmentMin) && Number.isInteger(product.readyForShipmentMax);

      this.videoUrl = ProductHelper.getImageCdnUrl(product, 'youTubeVideos', 'view1');

      // if (
      //   ProductHelper.isMasterProduct(product) &&
      //   ProductVariationHelper.hasDefaultVariation(product) &&
      //   !this.featureToggleService.enabled('advancedVariationHandling')
      // ) {
      //   this.redirectToVariation(product.defaultVariation(), true);
      // }
      // // if (ProductHelper.isMasterProduct(product) && this.featureToggleService.enabled('advancedVariationHandling')) {
      // //   this.shoppingFacade.loadMoreProducts({ type: 'master', value: product.sku }, 1);
      // // }
      // this.retailSetParts$.next(
      //   ProductHelper.isRetailSet(product) ? product.partSKUs.map(sku => ({ sku, quantity: 1 })) : []
      // );
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getValue(attributes: Attributes[], attributeName: string) {
    return attributes.find(x => x.name === attributeName)?.value || '-';
  }

  addToBasket() {
    // this.productToBasket.emit({
    //   sku: this.product.sku,
    //   quantity: this.productDetailForm.get(this.quantityControlName).value,
    // });
  }

  toggleCompare() {
    // this.compareToggle.emit();
  }

  addToCompare() {
    // this.productToCompare.emit(this.product.sku);
  }

  // variationSelected(event: { selection: VariationSelection; changedAttribute?: string }) {
  //   // this.selectVariation.emit(event);
  // }

  // redirectToVariation(variation: VariationProductView, replaceUrl = false) {
  //   this.appRef.isStable
  //     .pipe(
  //       filter(() => !!variation),
  //       whenTruthy(),
  //       take(1),
  //       map(() => variation),
  //       withLatestFrom(this.category$),
  //       takeUntil(this.destroy$)
  //     )
  //     .subscribe(([product, category]) => {
  //       this.ngZone.run(() => {
  //         this.router.navigateByUrl(generateProductUrl(product, category), { replaceUrl });
  //       });
  //     });
  // }
}
