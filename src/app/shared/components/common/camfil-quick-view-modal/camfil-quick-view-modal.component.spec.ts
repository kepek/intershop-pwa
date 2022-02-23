import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { provideMockStore } from '@ngrx/store/testing';
import { CamfilChannelToggleDirective } from 'camfil-pwa/directives/camfil-channel-toggle.directive';
import { MockComponent, MockDirective, MockPipe } from 'ng-mocks';
import { LazyProductAddToCamCardComponent } from 'src/app/extensions/cam-cards/exports/lazy-product-add-to-cam-card/lazy-product-add-to-cam-card.component';

import { PricePipe } from 'ish-core/models/price/price.pipe';
import { CamfilDimensionPipe } from 'ish-core/pipes/camfil-dimension.pipe';
import { ContentIncludeComponent } from 'ish-shared/cms/components/content-include/content-include.component';
import { ContentViewcontextComponent } from 'ish-shared/cms/components/content-viewcontext/content-viewcontext.component';
import { CamfilLoadingComponent } from 'ish-shared/components/common/camfil-loading/camfil-loading.component';
import { CamfilProductTechnicalDocumentsComponent } from 'ish-shared/components/common/camfil-product-technical-documents/camfil-product-technical-documents.component';
import { CamfilProductAddToBasketComponent } from 'ish-shared/components/product/camfil-product-add-to-basket/camfil-product-add-to-basket.component';
import { CamfilProductAddToCompareComponent } from 'ish-shared/components/product/camfil-product-add-to-compare/camfil-product-add-to-compare.component';
import { CamfilProductAttributeComponent } from 'ish-shared/components/product/camfil-product-attribute/camfil-product-attribute.component';
import { CamfilProductImageComponent } from 'ish-shared/components/product/camfil-product-image/camfil-product-image.component';
import { CamfilProductInventoryComponent } from 'ish-shared/components/product/camfil-product-inventory/camfil-product-inventory.component';
import { CamfilProductPriceComponent } from 'ish-shared/components/product/camfil-product-price/camfil-product-price.component';
import { CamfilProductPromotionComponent } from 'ish-shared/components/product/camfil-product-promotion/camfil-product-promotion.component';
import { CamfilProductQuantityComponent } from 'ish-shared/components/product/camfil-product-quantity/camfil-product-quantity.component';

import { CamfilQuickViewModalComponent } from './camfil-quick-view-modal.component';

describe('Camfil Quick View Modal Component', () => {
  let component: CamfilQuickViewModalComponent;
  let fixture: ComponentFixture<CamfilQuickViewModalComponent>;
  let element: HTMLElement;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        CamfilQuickViewModalComponent,
        MockComponent(CamfilLoadingComponent),
        MockComponent(CamfilProductAddToBasketComponent),
        MockComponent(CamfilProductAddToCompareComponent),
        MockComponent(CamfilProductAttributeComponent),
        MockComponent(CamfilProductImageComponent),
        MockComponent(CamfilProductInventoryComponent),
        MockComponent(CamfilProductPriceComponent),
        MockComponent(CamfilProductPromotionComponent),
        MockComponent(CamfilProductQuantityComponent),
        MockComponent(CamfilProductTechnicalDocumentsComponent),
        MockComponent(ContentIncludeComponent),
        MockComponent(ContentViewcontextComponent),
        MockComponent(LazyProductAddToCamCardComponent),
        MockDirective(CamfilChannelToggleDirective),
        MockPipe(CamfilDimensionPipe),
        MockPipe(PricePipe),
      ],
      providers: [{ provide: MAT_DIALOG_DATA, useValue: { sku: 'sku' } }, provideMockStore()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilQuickViewModalComponent);
    component = fixture.componentInstance;
    component.data = { sku: 'sku' };
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
