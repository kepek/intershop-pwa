import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { provideMockStore } from '@ngrx/store/testing';
import { MockComponent, MockPipe } from 'ng-mocks';
import { of } from 'rxjs';
import { anything, instance, mock, when } from 'ts-mockito';

import { CamfilMaxLengthAttributeCreateDirective } from 'ish-core/directives/camfil-max-length-attribute-create.directive';
import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { LineItemView } from 'ish-core/models/line-item/line-item.model';
import { PricePipe } from 'ish-core/models/price/price.pipe';
import { ProductView } from 'ish-core/models/product-view/product-view.model';
import { CamfilDimensionPipe } from 'ish-core/pipes/camfil-dimension.pipe';
import { CamfilPriceSummaryPipe } from 'ish-core/pipes/camfil-price-summary.pipe';
import { CamfilProductAttributeValPipe } from 'ish-core/pipes/camfil-product-attribute-val';
import { CamfilSlugifyPipe } from 'ish-core/pipes/camfil-slugify.pipe';
import { DatePipe } from 'ish-core/pipes/date.pipe';
import { ProductRoutePipe } from 'ish-core/routing/product/product-route.pipe';
import { ContentIncludeComponent } from 'ish-shared/cms/components/content-include/content-include.component';
import { CamfilErrorComponent } from 'ish-shared/components/common/camfil-error/camfil-error.component';
import { CamfilLoadingComponent } from 'ish-shared/components/common/camfil-loading/camfil-loading.component';
import { CamfilSmallCtaModalComponent } from 'ish-shared/components/common/camfil-small-cta-modal/camfil-small-cta-modal.component';
import { CamfilProductAddToBasketComponent } from 'ish-shared/components/product/camfil-product-add-to-basket/camfil-product-add-to-basket.component';
import { CamfilProductAttributeComponent } from 'ish-shared/components/product/camfil-product-attribute/camfil-product-attribute.component';
import { CamfilProductIdComponent } from 'ish-shared/components/product/camfil-product-id/camfil-product-id.component';
import { CamfilProductImageComponent } from 'ish-shared/components/product/camfil-product-image/camfil-product-image.component';
import { CamfilProductInventoryComponent } from 'ish-shared/components/product/camfil-product-inventory/camfil-product-inventory.component';
import { CamfilProductPriceComponent } from 'ish-shared/components/product/camfil-product-price/camfil-product-price.component';
import { CamfilProductQuantityComponent } from 'ish-shared/components/product/camfil-product-quantity/camfil-product-quantity.component';
import { CamfilProductTitleComponent } from 'ish-shared/components/product/camfil-product-title/camfil-product-title.component';
import { ProductBundleDisplayComponent } from 'ish-shared/components/product/product-bundle-display/product-bundle-display.component';
import { ProductVariationDisplayComponent } from 'ish-shared/components/product/product-variation-display/product-variation-display.component';
import { CheckboxComponent } from 'ish-shared/forms/components/checkbox/checkbox.component';
import { InputComponent } from 'ish-shared/forms/components/input/input.component';

import { CamfilCheckoutLineItemComponent } from './camfil-checkout-line-item.component';

describe('Camfil Checkout Line Item Component', () => {
  let component: CamfilCheckoutLineItemComponent;
  let fixture: ComponentFixture<CamfilCheckoutLineItemComponent>;
  let element: HTMLElement;
  let shoppingFacadeMock: ShoppingFacade;
  let checkoutFacadeMock: CheckoutFacade;

  beforeEach(async () => {
    shoppingFacadeMock = mock(ShoppingFacade);
    checkoutFacadeMock = mock(CheckoutFacade);

    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [
        CamfilCheckoutLineItemComponent,
        CamfilErrorComponent,
        CamfilMaxLengthAttributeCreateDirective,
        MockComponent(CamfilLoadingComponent),
        MockComponent(CamfilProductAddToBasketComponent),
        MockComponent(CamfilProductAttributeComponent),
        MockComponent(CamfilProductIdComponent),
        MockComponent(CamfilProductImageComponent),
        MockComponent(CamfilProductInventoryComponent),
        MockComponent(CamfilProductPriceComponent),
        MockComponent(CamfilProductQuantityComponent),
        MockComponent(CamfilProductTitleComponent),
        MockComponent(CamfilSmallCtaModalComponent),
        MockComponent(CheckboxComponent),
        MockComponent(ContentIncludeComponent),
        MockComponent(FaIconComponent),
        MockComponent(InputComponent),
        MockComponent(ProductBundleDisplayComponent),
        MockComponent(ProductVariationDisplayComponent),
        MockPipe(CamfilDimensionPipe),
        MockPipe(CamfilPriceSummaryPipe),
        MockPipe(CamfilProductAttributeValPipe),
        MockPipe(CamfilSlugifyPipe),
        MockPipe(DatePipe),
        MockPipe(PricePipe),
        MockPipe(ProductRoutePipe),
      ],
      providers: [
        { provide: ShoppingFacade, useFactory: () => instance(shoppingFacadeMock) },
        { provide: CheckoutFacade, useFactory: () => instance(checkoutFacadeMock) },
        provideMockStore({}),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilCheckoutLineItemComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    component.lineItem = ({
      quantity: {
        value: 5,
      },
    } as unknown) as LineItemView;

    when(shoppingFacadeMock.product$(anything(), anything())).thenReturn(of({ sku: '4713' } as ProductView));
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
