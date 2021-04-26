import { ChangeDetectionStrategy, Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { Attribute } from 'ish-core/models/attribute/attribute.model';
import { ImageTypes } from 'ish-core/models/image/image.types';
import {
  ProductView,
  VariationProductMasterView,
  VariationProductView,
} from 'ish-core/models/product-view/product-view.model';
import { ProductCompletenessLevel, ProductHelper, ProductPrices } from 'ish-core/models/product/product.model';
import { GenerateLazyComponent } from 'ish-core/utils/module-loader/generate-lazy-component.decorator';
import { whenTruthy } from 'ish-core/utils/operators';

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
    private sanitizer: DomSanitizer,
    private dialogRef: MatDialogRef<CamfilQuickViewModalComponent>,
    private accountFacade: AccountFacade
  ) {}

  get quantityCount() {
    return this.productDetailForm.get(this.quantityControlName).value;
  }

  product$: Observable<ProductView | VariationProductView | VariationProductMasterView>;
  quantity: number;
  price$: Observable<ProductPrices>;
  private destroy$ = new Subject();
  isInCompareList: boolean;
  multipleValuesSeparator = ', ';
  productDetailForm: FormGroup;
  isShipmentInformationAvailable = false;
  readonly quantityControlName = 'quantity';
  secureVideoUrl: SafeResourceUrl;
  showAddToCompare = false;
  isLoggedIn = false;
  // tslint:disable-next-line:force-jsdoc-comments
  // product attributes
  frameSize;
  pressureDrop;
  isoClass;
  energyClass;
  width;
  depth;
  height;
  bags;

  isProductBundle = ProductHelper.isProductBundle;
  isRetailSet = ProductHelper.isRetailSet;
  isMasterProduct = ProductHelper.isMasterProduct;
  getImageViewIDs = ProductHelper.getImageViewIDs;
  getImageCdnUrl = ProductHelper.getImageCdnUrl;
  showAvailabilityDot = ProductHelper.showAvailabilityDot;

  isNotZero = ProductHelper.isNotZero;

  ngOnInit(): void {
    this.accountFacade.isLoggedIn$.pipe(takeUntil(this.destroy$)).subscribe(value => {
      this.isLoggedIn = value;
    });
    this.product$ = this.shoppingFacade.product$(this.data.sku, ProductCompletenessLevel.Detail);
    this.product$.pipe(whenTruthy(), takeUntil(this.destroy$)).subscribe(product => {
      this.quantity = 0;
      this.productDetailForm = new FormGroup({
        [this.quantityControlName]: new FormControl(this.quantity),
      });

      this.isShipmentInformationAvailable =
        Number.isInteger(product.readyForShipmentMin) && Number.isInteger(product.readyForShipmentMax);

      this.shoppingFacade
        .inCompareProducts$(product.sku)
        .pipe(whenTruthy(), takeUntil(this.destroy$))
        // tslint:disable-next-line: rxjs-no-nested-subscribe
        .subscribe(state => {
          this.isInCompareList = state;
        });

      this.frameSize = this.getAttributeValue(product.attributes, 'FrameSize');
      this.pressureDrop = this.getAttributeValue(product.attributes, 'Pressuredrop');
      this.isoClass = this.getAttributeValue(product.attributes, 'IsoClass');
      this.energyClass = this.getAttributeValue(product.attributes, 'Energyclass');
      this.bags = this.getAttributeValue(product.attributes, 'Filterbags');
      this.width = this.getAttributeValue(product.attributes, 'Width');
      this.depth = this.getAttributeValue(product.attributes, 'Depth');
      this.height = this.getAttributeValue(product.attributes, 'Height');
      const videoUrl = this.getImageCdnUrl(product, ImageTypes.YtVideo, 'view1');
      if (videoUrl) {
        this.secureVideoUrl = this.sanitizer.bypassSecurityTrustResourceUrl(videoUrl);
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getAttributeValue(attributes: Attribute[], attributeName: string) {
    return attributes.find(x => x.name === attributeName)?.value;
  }

  addToBasket(sku) {
    this.shoppingFacade.addProductToBasket(sku, this.quantityCount);
    this.dialog.closeAll();
  }

  toggleCompare(sku) {
    this.shoppingFacade.toggleProductCompare(sku);
    this.isInCompareList = !this.isInCompareList;
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
