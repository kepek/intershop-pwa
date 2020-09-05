import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { findAllCamfilElements } from 'camfil-core/utils/dev/html-query-utils';
import { MockComponent, MockDirective, MockPipe } from 'ng-mocks';

import { FeatureToggleModule } from 'ish-core/feature-toggle.module';
import { ProductView } from 'ish-core/models/product-view/product-view.model';
import { ProductRoutePipe } from 'ish-core/routing/product/product-route.pipe';
import { findAllIshElements } from 'ish-core/utils/dev/html-query-utils';
import { CamfilProductAddToBasketComponent } from 'ish-shared/components/product/camfil-product-add-to-basket/camfil-product-add-to-basket.component';
import { CamfilProductAddToCompareComponent } from 'ish-shared/components/product/camfil-product-add-to-compare/camfil-product-add-to-compare.component';
import { DEFAULT_CONFIGURATION } from 'ish-shared/components/product/camfil-product-item/camfil-product-item.component';
import { CamfilProductLabelComponent } from 'ish-shared/components/product/camfil-product-label/camfil-product-label.component';
import { CamfilProductPriceComponent } from 'ish-shared/components/product/camfil-product-price/camfil-product-price.component';
import { ProductPromotionComponent } from 'ish-shared/components/product/product-promotion/product-promotion.component';
import { ProductRatingComponent } from 'ish-shared/components/product/product-rating/product-rating.component';
import { ProductVariationSelectComponent } from 'ish-shared/components/product/product-variation-select/product-variation-select.component';
import { CamfilProductImageComponent } from 'ish-shell/header/camfil-product-image/camfil-product-image.component';

import { LazyProductAddToOrderTemplateComponent } from '../../../../extensions/order-templates/exports/lazy-product-add-to-order-template/lazy-product-add-to-order-template.component';
import { LazyProductAddToQuoteComponent } from '../../../../extensions/quoting/exports/lazy-product-add-to-quote/lazy-product-add-to-quote.component';
import { IsTactonProductDirective } from '../../../../extensions/tacton/directives/is-tacton-product.directive';
import { LazyTactonConfigureProductComponent } from '../../../../extensions/tacton/exports/lazy-tacton-configure-product/lazy-tacton-configure-product.component';
import { LazyProductAddToWishlistComponent } from '../../../../extensions/wishlists/exports/lazy-product-add-to-wishlist/lazy-product-add-to-wishlist.component';
import { ProductAddToWishlistComponent } from '../../../../extensions/wishlists/shared/product-add-to-wishlist/product-add-to-wishlist.component';

import { ProductTileComponent } from './product-tile.component';

describe('Product Tile Component', () => {
  let component: ProductTileComponent;
  let fixture: ComponentFixture<ProductTileComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FeatureToggleModule.forTesting(), RouterTestingModule, TranslateModule.forRoot()],
      declarations: [
        MockComponent(CamfilProductAddToBasketComponent),
        MockComponent(CamfilProductAddToCompareComponent),
        MockComponent(CamfilProductLabelComponent),
        MockComponent(CamfilProductPriceComponent),
        MockComponent(LazyProductAddToOrderTemplateComponent),
        MockComponent(LazyProductAddToQuoteComponent),
        MockComponent(LazyProductAddToWishlistComponent),
        MockComponent(LazyTactonConfigureProductComponent),
        MockComponent(ProductAddToWishlistComponent),
        MockComponent(CamfilProductImageComponent),
        MockComponent(ProductPromotionComponent),
        MockComponent(ProductRatingComponent),
        MockComponent(ProductVariationSelectComponent),
        MockDirective(IsTactonProductDirective),
        MockPipe(ProductRoutePipe),
        ProductTileComponent,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductTileComponent);
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
    expect(findAllIshElements(element)).toMatchInlineSnapshot(`
      Array [
        "ish-product-promotion",
      ]
    `);
    expect(findAllCamfilElements(element)).toMatchInlineSnapshot(`
      Array [
        "camfil-lazy-product-add-to-order-template",
        "camfil-lazy-product-add-to-quote",
        "camfil-lazy-product-add-to-wishlist",
        "camfil-product-add-to-basket",
        "camfil-product-add-to-compare",
        "camfil-product-image",
        "camfil-product-label",
        "camfil-product-price",
        "camfil-product-price",
      ]
    `);
  });

  it('should render almost no elements when configured with empty configuration', () => {
    component.configuration = {};
    fixture.detectChanges();
    expect(findAllCamfilElements(element)).toMatchInlineSnapshot(`
      Array [
        "camfil-product-image",
        "camfil-product-label",
      ]
    `);
  });
});
