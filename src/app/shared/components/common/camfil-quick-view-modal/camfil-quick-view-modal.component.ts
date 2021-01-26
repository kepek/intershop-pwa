import { ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Attributes } from '@fortawesome/fontawesome-svg-core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import {
  ProductView,
  VariationProductMasterView,
  VariationProductView,
} from 'ish-core/models/product-view/product-view.model';
import { ProductCompletenessLevel, ProductHelper, ProductPrices } from 'ish-core/models/product/product.model';
import { GenerateLazyComponent } from 'ish-core/utils/module-loader/generate-lazy-component.decorator';
import { whenTruthy } from 'ish-core/utils/operators';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

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
export class CamfilQuickViewModalComponent implements OnInit, OnDestroy {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public dialog: MatDialog,
    private shoppingFacade: ShoppingFacade,
    private sanitizer: DomSanitizer
  ) {}

  product$: Observable<ProductView | VariationProductView | VariationProductMasterView>;
  quantity: number;
  price$: Observable<ProductPrices>;
  private destroy$ = new Subject();
  isInCompareList: boolean;
  multipleValuesSeparator = ', ';
  productDetailForm: FormGroup;
  isShipmentInformationAvailable = false;
  readonly quantityControlName = 'quantity';
  videoUrl: SafeResourceUrl;

  isProductBundle = ProductHelper.isProductBundle;
  isRetailSet = ProductHelper.isRetailSet;
  isMasterProduct = ProductHelper.isMasterProduct;
  getImageViewIDs = ProductHelper.getImageViewIDs;

  ngOnInit(): void {
    this.product$ = this.shoppingFacade.product$(this.data.sku, ProductCompletenessLevel.Detail);
    this.product$.pipe(whenTruthy(), takeUntil(this.destroy$)).subscribe(product => {
      this.quantity = product.minOrderQuantity;
      this.productDetailForm = new FormGroup({
        [this.quantityControlName]: new FormControl(this.quantity || product.minOrderQuantity),
      });

      this.isShipmentInformationAvailable =
        Number.isInteger(product.readyForShipmentMin) && Number.isInteger(product.readyForShipmentMax);
      this.videoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
        ProductHelper.getImageCdnUrl(product, 'youTubeVideos', 'view1')
      );
      this.shoppingFacade
        .inCompareProducts$(product.sku)
        .pipe(whenTruthy(), takeUntil(this.destroy$))
        // tslint:disable-next-line: rxjs-no-nested-subscribe
        .subscribe(state => {
          this.isInCompareList = state;
        });
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getValue(attributes: Attributes[], attributeName: string) {
    return attributes.find(x => x.name === attributeName)?.value || '-';
  }

  addToBasket(sku) {
    this.shoppingFacade.addProductToBasket(sku, this.quantity);
    this.dialog.closeAll();
  }

  toggleCompare(sku) {
    this.shoppingFacade.toggleProductCompare(sku);
    this.isInCompareList = !this.isInCompareList;
  }
}
