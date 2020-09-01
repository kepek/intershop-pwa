import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockDirective } from 'ng-mocks';

import { FeatureToggleDirective } from 'ish-core/directives/feature-toggle.directive';
import { ProductView } from 'ish-core/models/product-view/product-view.model';
import { AccordionItemComponent } from 'ish-shared/components/common/accordion-item/accordion-item.component';
import { AccordionComponent } from 'ish-shared/components/common/accordion/accordion.component';
import { CamfilProductAttributesComponent } from 'ish-shared/components/product/camfil-product-attributes/camfil-product-attributes.component';
import { CamfilProductPriceComponent } from 'ish-shared/components/product/camfil-product-price/camfil-product-price.component';
import { ProductAddToBasketComponent } from 'ish-shared/components/product/product-add-to-basket/product-add-to-basket.component';
import { ProductAttributesComponent } from 'ish-shared/components/product/product-attributes/product-attributes.component';
import { ProductIdComponent } from 'ish-shared/components/product/product-id/product-id.component';
import { ProductInventoryComponent } from 'ish-shared/components/product/product-inventory/product-inventory.component';
import { ProductPromotionComponent } from 'ish-shared/components/product/product-promotion/product-promotion.component';
import { ProductQuantityComponent } from 'ish-shared/components/product/product-quantity/product-quantity.component';
import { ProductRatingComponent } from 'ish-shared/components/product/product-rating/product-rating.component';
import { ProductShipmentComponent } from 'ish-shared/components/product/product-shipment/product-shipment.component';
import { ProductVariationSelectComponent } from 'ish-shared/components/product/product-variation-select/product-variation-select.component';

import { LazyProductAddToOrderTemplateComponent } from '../../../extensions/order-templates/exports/product/lazy-product-add-to-order-template/lazy-product-add-to-order-template.component';
import { LazyProductAddToQuoteComponent } from '../../../extensions/quoting/exports/product/lazy-product-add-to-quote/lazy-product-add-to-quote.component';
import { ProductDetailActionsComponent } from '../../product/product-detail-actions/product-detail-actions.component';
import { ProductImagesComponent } from '../../product/product-images/product-images.component';
import { CamfilProductAttributesPreviewComponent } from '../camfil-product-attributes-preview/camfil-product-attributes-preview.component';
import { CamfilProductImagesComponent } from '../camfil-product-images/camfil-product-images.component';

import { CamfilProductDetailComponent } from './camfil-product-detail.component';

describe('Camfil Product Detail Component', () => {
  let component: CamfilProductDetailComponent;
  let fixture: ComponentFixture<CamfilProductDetailComponent>;
  let product: ProductView;
  let element: HTMLElement;

  beforeEach(async(() => {
    product = { sku: 'sku' } as ProductView;
    product.name = 'Test Product';
    product.longDescription = 'long description';
    product.manufacturer = undefined;

    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([{ path: 'search', component: CamfilProductDetailComponent }]),
        TranslateModule.forRoot(),
      ],
      declarations: [
        CamfilProductDetailComponent,
        MockComponent(AccordionComponent),
        MockComponent(AccordionItemComponent),
        MockComponent(CamfilProductAttributesComponent),
        MockComponent(CamfilProductAttributesPreviewComponent),
        MockComponent(CamfilProductImagesComponent),
        MockComponent(CamfilProductPriceComponent),
        MockComponent(LazyProductAddToOrderTemplateComponent),
        MockComponent(LazyProductAddToQuoteComponent),
        MockComponent(ProductAddToBasketComponent),
        MockComponent(ProductAttributesComponent),
        MockComponent(ProductDetailActionsComponent),
        MockComponent(ProductIdComponent),
        MockComponent(ProductImagesComponent),
        MockComponent(ProductInventoryComponent),
        MockComponent(ProductPromotionComponent),
        MockComponent(ProductQuantityComponent),
        MockComponent(ProductRatingComponent),
        MockComponent(ProductShipmentComponent),
        MockComponent(ProductVariationSelectComponent),
        MockDirective(FeatureToggleDirective),
      ],
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(CamfilProductDetailComponent);
        component = fixture.componentInstance;
        element = fixture.nativeElement;
        component.product = product;
      });
  }));

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
