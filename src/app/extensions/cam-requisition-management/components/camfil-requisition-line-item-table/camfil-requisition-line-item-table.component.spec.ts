import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { MockComponent, MockPipe } from 'ng-mocks';
import { instance, mock } from 'ts-mockito';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { PricePipe } from 'ish-core/models/price/price.pipe';
import { CamfilPriceSummaryPipe } from 'ish-core/pipes/camfil-price-summary.pipe';
import { DatePipe } from 'ish-core/pipes/date.pipe';
import { CamfilSmallCtaModalComponent } from 'ish-shared/components/common/camfil-small-cta-modal/camfil-small-cta-modal.component';
import { CamfilProductAttributeComponent } from 'ish-shared/components/product/camfil-product-attribute/camfil-product-attribute.component';
import { CamfilProductImageComponent } from 'ish-shared/components/product/camfil-product-image/camfil-product-image.component';
import { CamfilProductInventoryComponent } from 'ish-shared/components/product/camfil-product-inventory/camfil-product-inventory.component';
import { CamfilProductQuickviewComponent } from 'ish-shared/components/product/camfil-product-quickview/camfil-product-quickview.component';
import { CamfilProductTitleComponent } from 'ish-shared/components/product/camfil-product-title/camfil-product-title.component';

import { CamfilRequisitionLineItemBoxLabelComponent } from './camfil-requisition-line-item-box-label/camfil-requisition-line-item-box-label.component';
import { CamfilRequisitionLineItemQuantityComponent } from './camfil-requisition-line-item-quantity/camfil-requisition-line-item-quantity.component';
import { CamfilRequisitionLineItemTableComponent } from './camfil-requisition-line-item-table.component';

describe('Camfil Requisition Line Item Table Component', () => {
  let component: CamfilRequisitionLineItemTableComponent;
  let fixture: ComponentFixture<CamfilRequisitionLineItemTableComponent>;
  let element: HTMLElement;
  let shoppingFacadeMock: ShoppingFacade;

  beforeEach(async () => {
    shoppingFacadeMock = mock(ShoppingFacade);

    await TestBed.configureTestingModule({
      declarations: [
        CamfilRequisitionLineItemTableComponent,
        MockComponent(CamfilProductAttributeComponent),
        MockComponent(CamfilProductImageComponent),
        MockComponent(CamfilProductInventoryComponent),
        MockComponent(CamfilProductQuickviewComponent),
        MockComponent(CamfilProductTitleComponent),
        MockComponent(CamfilRequisitionLineItemBoxLabelComponent),
        MockComponent(CamfilRequisitionLineItemQuantityComponent),
        MockComponent(CamfilSmallCtaModalComponent),
        MockPipe(CamfilPriceSummaryPipe),
        MockPipe(DatePipe),
        MockPipe(PricePipe),
      ],
      providers: [{ provide: ShoppingFacade, useFactory: () => instance(shoppingFacadeMock) }, provideMockStore({})],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilRequisitionLineItemTableComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
