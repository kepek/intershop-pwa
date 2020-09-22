import { Location } from '@angular/common';
import { ComponentFixture, TestBed, async, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { findAllCamfilElements } from 'camfil-core/utils/dev/html-query-utils';
import { MockComponent } from 'ng-mocks';
import { EMPTY, noop, of } from 'rxjs';
import { anything, instance, mock, verify, when } from 'ts-mockito';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { FeatureToggleModule } from 'ish-core/feature-toggle.module';
import { createCategoryView } from 'ish-core/models/category-view/category-view.model';
import { Category } from 'ish-core/models/category/category.model';
import { VariationSelection } from 'ish-core/models/product-variation/variation-selection.model';
import {
  VariationProductView,
  createProductView,
  createVariationProductMasterView,
} from 'ish-core/models/product-view/product-view.model';
import { ProductRetailSet } from 'ish-core/models/product/product-retail-set.model';
import { VariationProductMaster } from 'ish-core/models/product/product-variation-master.model';
import { VariationProduct } from 'ish-core/models/product/product-variation.model';
import { Product, ProductCompletenessLevel } from 'ish-core/models/product/product.model';
import { ProductRoutePipe } from 'ish-core/routing/product/product-route.pipe';
import { findAllIshElements } from 'ish-core/utils/dev/html-query-utils';
import { categoryTree } from 'ish-core/utils/dev/test-data-utils';
import { CamfilBreadcrumbComponent } from 'ish-shared/components/common/camfil-breadcrumb/camfil-breadcrumb.component';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';
import { RecentlyViewedComponent } from 'ish-shared/components/recently/recently-viewed/recently-viewed.component';

import { CamfilProductLinksComponent } from '../product/camfil-product-links/camfil-product-links.component';
import { ProductBundlePartsComponent } from '../product/product-bundle-parts/product-bundle-parts.component';
import { ProductDetailComponent } from '../product/product-detail/product-detail.component';
import { ProductMasterVariationsComponent } from '../product/product-master-variations/product-master-variations.component';
import { RetailSetPartsComponent } from '../product/retail-set-parts/retail-set-parts.component';

import { CamfilProductAttributesPreviewComponent } from './camfil-product-attributes-preview/camfil-product-attributes-preview.component';
import { CamfilProductDetailComponent } from './camfil-product-detail/camfil-product-detail.component';
import { CamfilProductGuidesComponent } from './camfil-product-guides/camfil-product-guides.component';
import { CamfilProductImagesComponent } from './camfil-product-images/camfil-product-images.component';
import { CamfilProductPageComponent } from './camfil-product-page.component';

describe('Camfil Product Page Component', () => {
  let component: CamfilProductPageComponent;
  let fixture: ComponentFixture<CamfilProductPageComponent>;
  let element: HTMLElement;
  let location: Location;
  let shoppingFacade: ShoppingFacade;

  const categories = categoryTree([{ uniqueId: 'A', categoryPath: ['A'] } as Category]);

  beforeEach(async(() => {
    shoppingFacade = mock(ShoppingFacade);
    when(shoppingFacade.selectedProduct$).thenReturn(EMPTY);
    when(shoppingFacade.selectedCategory$).thenReturn(of(createCategoryView(categories, 'A')));

    TestBed.configureTestingModule({
      imports: [
        FeatureToggleModule.forTesting('recently'),
        RouterTestingModule.withRoutes([{ path: '**', component: CamfilProductPageComponent }]),
      ],
      declarations: [
        CamfilProductPageComponent,
        MockComponent(CamfilBreadcrumbComponent),
        MockComponent(CamfilProductAttributesPreviewComponent),
        MockComponent(CamfilProductDetailComponent),
        MockComponent(CamfilProductGuidesComponent),
        MockComponent(CamfilProductImagesComponent),
        MockComponent(CamfilProductLinksComponent),
        MockComponent(LoadingComponent),
        MockComponent(ProductBundlePartsComponent),
        MockComponent(ProductDetailComponent),
        MockComponent(ProductMasterVariationsComponent),
        MockComponent(RecentlyViewedComponent),
        MockComponent(RetailSetPartsComponent),
      ],
      providers: [ProductRoutePipe, { provide: ShoppingFacade, useFactory: () => instance(shoppingFacade) }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilProductPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    location = TestBed.inject(Location);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display loading when product is loading', () => {
    when(shoppingFacade.productDetailLoading$).thenReturn(of(true));

    fixture.detectChanges();

    expect(findAllIshElements(element)).toEqual(['ish-loading', 'ish-recently-viewed']);
  });

  xit('should display product-detail when product is available', () => {
    const product = { sku: 'dummy', completenessLevel: ProductCompletenessLevel.Detail } as Product;
    when(shoppingFacade.selectedProduct$).thenReturn(of(createProductView(product, categories)));

    fixture.detectChanges();

    expect(findAllIshElements(element)).toEqual(['ish-product-detail', 'camfil-product-links', 'ish-recently-viewed']);
    expect(findAllCamfilElements(element)).toEqual(['camfil-breadcrumb']);
  });

  it('should redirect to product page when variation is selected', fakeAsync(() => {
    const product = {
      sku: '222',
      variableVariationAttributes: [
        { name: 'Attr 1', type: 'VariationAttribute', value: 'B', variationAttributeId: 'a1' },
        { name: 'Attr 2', type: 'VariationAttribute', value: 'D', variationAttributeId: 'a2' },
      ],
      variations: () => [
        {
          sku: '222',
          variableVariationAttributes: [
            { name: 'Attr 1', type: 'VariationAttribute', value: 'B', variationAttributeId: 'a1' },
            { name: 'Attr 2', type: 'VariationAttribute', value: 'D', variationAttributeId: 'a2' },
          ],
        },
        {
          sku: '333',
          attributes: [{ name: 'defaultVariation', type: 'Boolean', value: true }],
          variableVariationAttributes: [
            { name: 'Attr 1', type: 'VariationAttribute', value: 'A', variationAttributeId: 'a1' },
            { name: 'Attr 2', type: 'VariationAttribute', value: 'D', variationAttributeId: 'a2' },
          ],
          defaultCategory: noop,
        },
      ],
    } as VariationProductView;

    const selection: VariationSelection = {
      a1: 'A',
      a2: 'D',
    };

    fixture.detectChanges();

    component.variationSelected({ selection }, product);
    tick(500);

    expect(location.path()).toMatchInlineSnapshot(`"/sku333-catA"`);
  }));

  describe('redirecting to default variation', () => {
    const product = {
      sku: 'M111',
      type: 'VariationProductMaster',
      completenessLevel: ProductCompletenessLevel.Detail,
      defaultVariationSKU: '222',
    } as VariationProductMaster;
    const variation1 = { sku: '111' } as VariationProduct;
    const variation2 = {
      sku: '222',
      attributes: [{ name: 'defaultVariation', type: 'Boolean', value: true }],
      completenessLevel: ProductCompletenessLevel.Detail,
      defaultCategoryId: 'A',
    } as VariationProduct;

    beforeEach(() => {
      when(shoppingFacade.selectedProduct$).thenReturn(
        of(createVariationProductMasterView(product, { 111: variation1, 222: variation2 }, categories))
      );
      TestBed.inject(Router).navigateByUrl('/product/M111');
    });

    it('should redirect to default variation for master product', fakeAsync(() => {
      fixture.detectChanges();
      tick(500);

      expect(location.path()).toMatchInlineSnapshot(`"/sku222-catA"`);
    }));

    it('should not redirect to default variation for master product if advanced variation handling is activated', fakeAsync(() => {
      FeatureToggleModule.switchTestingFeatures('advancedVariationHandling');

      fixture.detectChanges();
      tick(500);

      expect(location.path()).toMatchInlineSnapshot(`"/product/M111"`);
    }));
  });

  it('should only dispatch retail set products when quantities are greater than 0', () => {
    const product = {
      sku: 'ABC',
      partSKUs: ['A', 'B', 'C'],
      type: 'RetailSet',
    } as ProductRetailSet;
    when(shoppingFacade.selectedProduct$).thenReturn(of(createProductView(product, categories)));

    fixture.detectChanges();

    component.retailSetParts$.next([
      { sku: 'A', quantity: 1 },
      { sku: 'B', quantity: 0 },
      { sku: 'C', quantity: 1 },
    ]);

    component.addToBasket();
    verify(shoppingFacade.addProductToBasket('A', 1)).once();
    verify(shoppingFacade.addProductToBasket('C', 1)).once();
    verify(shoppingFacade.addProductToBasket('B', anything())).never();
  });
});
