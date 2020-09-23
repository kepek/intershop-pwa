import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockDirective } from 'ng-mocks';

import { FeatureToggleDirective } from 'ish-core/directives/feature-toggle.directive';
import { ProductView } from 'ish-core/models/product-view/product-view.model';
import { AccordionItemComponent } from 'ish-shared/components/common/accordion-item/accordion-item.component';
import { AccordionComponent } from 'ish-shared/components/common/accordion/accordion.component';
import { CamfilProductAddToBasketComponent } from 'ish-shared/components/product/camfil-product-add-to-basket/camfil-product-add-to-basket.component';
import { CamfilProductAttributesComponent } from 'ish-shared/components/product/camfil-product-attributes/camfil-product-attributes.component';
import { CamfilProductIdComponent } from 'ish-shared/components/product/camfil-product-id/camfil-product-id.component';
import { CamfilProductInventoryComponent } from 'ish-shared/components/product/camfil-product-inventory/camfil-product-inventory.component';
import { CamfilProductPriceComponent } from 'ish-shared/components/product/camfil-product-price/camfil-product-price.component';
import { CamfilProductPromotionComponent } from 'ish-shared/components/product/camfil-product-promotion/camfil-product-promotion.component';
import { CamfilProductQuantityComponent } from 'ish-shared/components/product/camfil-product-quantity/camfil-product-quantity.component';
import { CamfilProductRatingComponent } from 'ish-shared/components/product/camfil-product-rating/camfil-product-rating.component';
import { CamfilProductShipmentComponent } from 'ish-shared/components/product/camfil-product-shipment/camfil-product-shipment.component';
import { CamfilProductVariationSelectComponent } from 'ish-shared/components/product/camfil-product-variation-select/camfil-product-variation-select.component';
import { ProductAttributesComponent } from 'ish-shared/components/product/product-attributes/product-attributes.component';

import { LazyProductAddToCamCardComponent } from '../../../extensions/cam-cards/exports/lazy-product-add-to-cam-card/lazy-product-add-to-cam-card.component';
import { LazyProductAddToOrderTemplateComponent } from '../../../extensions/order-templates/exports/lazy-product-add-to-order-template/lazy-product-add-to-order-template.component';
import { LazyProductAddToQuoteComponent } from '../../../extensions/quoting/exports/lazy-product-add-to-quote/lazy-product-add-to-quote.component';
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
        MockComponent(CamfilProductAddToBasketComponent),
        MockComponent(CamfilProductAttributesComponent),
        MockComponent(CamfilProductAttributesPreviewComponent),
        MockComponent(CamfilProductIdComponent),
        MockComponent(CamfilProductImagesComponent),
        MockComponent(CamfilProductInventoryComponent),
        MockComponent(CamfilProductPriceComponent),
        MockComponent(CamfilProductPromotionComponent),
        MockComponent(CamfilProductQuantityComponent),
        MockComponent(CamfilProductRatingComponent),
        MockComponent(CamfilProductShipmentComponent),
        MockComponent(CamfilProductVariationSelectComponent),
        MockComponent(LazyProductAddToCamCardComponent),
        MockComponent(LazyProductAddToOrderTemplateComponent),
        MockComponent(LazyProductAddToQuoteComponent),
        MockComponent(ProductAttributesComponent),
        MockComponent(ProductDetailActionsComponent),
        MockComponent(ProductImagesComponent),
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
