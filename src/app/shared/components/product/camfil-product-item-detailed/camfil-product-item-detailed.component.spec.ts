import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockDirective, MockPipe } from 'ng-mocks';

import { FeatureToggleDirective } from 'ish-core/directives/feature-toggle.directive';
import { ProductView } from 'ish-core/models/product-view/product-view.model';
import { ProductRoutePipe } from 'ish-core/routing/product/product-route.pipe';
import { findAllCustomElements } from 'ish-core/utils/dev/html-query-utils';
import { CamfilProductAddToBasketComponent } from 'ish-shared/components/product/camfil-product-add-to-basket/camfil-product-add-to-basket.component';
import { CamfilProductAddToCompareComponent } from 'ish-shared/components/product/camfil-product-add-to-compare/camfil-product-add-to-compare.component';
import { CamfilProductIdComponent } from 'ish-shared/components/product/camfil-product-id/camfil-product-id.component';
import { CamfilProductInventoryComponent } from 'ish-shared/components/product/camfil-product-inventory/camfil-product-inventory.component';
import { DEFAULT_CONFIGURATION } from 'ish-shared/components/product/camfil-product-item/camfil-product-item.component';
import { CamfilProductLabelComponent } from 'ish-shared/components/product/camfil-product-label/camfil-product-label.component';
import { CamfilProductPriceComponent } from 'ish-shared/components/product/camfil-product-price/camfil-product-price.component';
import { CamfilProductPromotionComponent } from 'ish-shared/components/product/camfil-product-promotion/camfil-product-promotion.component';
import { CamfilProductQuantityComponent } from 'ish-shared/components/product/camfil-product-quantity/camfil-product-quantity.component';
import { CamfilProductRatingComponent } from 'ish-shared/components/product/camfil-product-rating/camfil-product-rating.component';
import { CamfilProductShipmentComponent } from 'ish-shared/components/product/camfil-product-shipment/camfil-product-shipment.component';
import { CamfilProductVariationSelectComponent } from 'ish-shared/components/product/camfil-product-variation-select/camfil-product-variation-select.component';
import { CamfilProductImageComponent } from 'ish-shell/header/camfil-product-image/camfil-product-image.component';

import { LazyProductAddToCamCardComponent } from '../../../../extensions/cam-cards/exports/lazy-product-add-to-cam-card/lazy-product-add-to-cam-card.component';
import { LazyProductAddToOrderTemplateComponent } from '../../../../extensions/order-templates/exports/lazy-product-add-to-order-template/lazy-product-add-to-order-template.component';
import { LazyProductAddToQuoteComponent } from '../../../../extensions/quoting/exports/lazy-product-add-to-quote/lazy-product-add-to-quote.component';
import { LazyProductAddToWishlistComponent } from '../../../../extensions/wishlists/exports/lazy-product-add-to-wishlist/lazy-product-add-to-wishlist.component';

import { CamfilProductItemDetailedComponent } from './camfil-product-item-detailed.component';

describe('Camfil Product Item Detailed Component', () => {
  let component: CamfilProductItemDetailedComponent;
  let fixture: ComponentFixture<CamfilProductItemDetailedComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, RouterTestingModule, TranslateModule.forRoot()],
      declarations: [
        CamfilProductItemDetailedComponent,
        MockComponent(CamfilProductAddToBasketComponent),
        MockComponent(CamfilProductAddToCompareComponent),
        MockComponent(CamfilProductIdComponent),
        MockComponent(CamfilProductImageComponent),
        MockComponent(CamfilProductInventoryComponent),
        MockComponent(CamfilProductLabelComponent),
        MockComponent(CamfilProductPriceComponent),
        MockComponent(CamfilProductPromotionComponent),
        MockComponent(CamfilProductQuantityComponent),
        MockComponent(CamfilProductRatingComponent),
        MockComponent(CamfilProductShipmentComponent),
        MockComponent(CamfilProductVariationSelectComponent),
        MockComponent(LazyProductAddToCamCardComponent),
        MockComponent(LazyProductAddToOrderTemplateComponent),
        MockComponent(LazyProductAddToQuoteComponent),
        MockComponent(LazyProductAddToWishlistComponent),
        MockDirective(FeatureToggleDirective),
        MockPipe(ProductRoutePipe),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilProductItemDetailedComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.product = { sku: 'sku' } as ProductView;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should render default elements when not specifically configured', () => {
    component.configuration = DEFAULT_CONFIGURATION;
    fixture.detectChanges();
    expect(findAllCustomElements(element)).toMatchInlineSnapshot(`
      Array [
        "camfil-product-image",
        "camfil-product-label",
        "camfil-product-id",
        "camfil-product-promotion",
        "ish-lazy-product-add-to-quote",
        "camfil-product-add-to-compare",
        "ish-lazy-product-add-to-wishlist",
        "camfil-lazy-product-add-to-cam-card",
        "camfil-product-price",
        "camfil-product-inventory",
        "camfil-product-quantity",
        "camfil-product-add-to-basket",
      ]
    `);
    expect(findAllCustomElements(element)).toMatchInlineSnapshot(`
      Array [
        "camfil-product-image",
        "camfil-product-label",
        "camfil-product-id",
        "camfil-product-promotion",
        "ish-lazy-product-add-to-quote",
        "camfil-product-add-to-compare",
        "ish-lazy-product-add-to-wishlist",
        "camfil-lazy-product-add-to-cam-card",
        "camfil-product-price",
        "camfil-product-inventory",
        "camfil-product-quantity",
        "camfil-product-add-to-basket",
      ]
    `);
  });

  it('should render almost no elements when configured with empty configuration', () => {
    component.configuration = {};
    fixture.detectChanges();
    expect(findAllCustomElements(element)).toMatchInlineSnapshot(`
      Array [
        "camfil-product-image",
        "camfil-product-label",
      ]
    `);
  });
});
