import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { MockComponent, MockPipe } from 'ng-mocks';
import { of } from 'rxjs';
import { anything, instance, mock, when } from 'ts-mockito';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { LineItemView } from 'ish-core/models/line-item/line-item.model';
import { PricePipe } from 'ish-core/models/price/price.pipe';
import { VariationProductView } from 'ish-core/models/product-view/product-view.model';
import { ProductCompletenessLevel } from 'ish-core/models/product/product.model';
import { findAllCustomElements } from 'ish-core/utils/dev/html-query-utils';
import { LoadingComponent } from 'ish-shared/components/common/loading/loading.component';
import { CamfilProductIdComponent } from 'ish-shared/components/product/camfil-product-id/camfil-product-id.component';
import { CamfilProductInventoryComponent } from 'ish-shared/components/product/camfil-product-inventory/camfil-product-inventory.component';
import { CamfilProductItemDetailedComponent } from 'ish-shared/components/product/camfil-product-item-detailed/camfil-product-item-detailed.component';
import { CamfilProductItemSimpleComponent } from 'ish-shared/components/product/camfil-product-item-simple/camfil-product-item-simple.component';
import { CamfilProductVariationSelectComponent } from 'ish-shared/components/product/camfil-product-variation-select/camfil-product-variation-select.component';
import { InputComponent } from 'ish-shared/forms/components/input/input.component';
import { CamfilProductImageComponent } from 'ish-shell/header/camfil-product-image/camfil-product-image.component';

import { LineItemEditDialogComponent } from './line-item-edit-dialog.component';

describe('Line Item Edit Dialog Component', () => {
  let component: LineItemEditDialogComponent;
  let fixture: ComponentFixture<LineItemEditDialogComponent>;
  let element: HTMLElement;
  let shoppingFacade: ShoppingFacade;

  beforeEach(async () => {
    shoppingFacade = mock(ShoppingFacade);

    await TestBed.configureTestingModule({
      imports: [NgbModalModule, ReactiveFormsModule, TranslateModule.forRoot()],
      declarations: [
        LineItemEditDialogComponent,
        MockComponent(CamfilProductIdComponent),
        MockComponent(CamfilProductImageComponent),
        MockComponent(CamfilProductInventoryComponent),
        MockComponent(CamfilProductItemDetailedComponent),
        MockComponent(CamfilProductItemSimpleComponent),
        MockComponent(CamfilProductVariationSelectComponent),
        MockComponent(InputComponent),
        MockComponent(LoadingComponent),
        MockPipe(PricePipe),
      ],
      providers: [{ provide: ShoppingFacade, useFactory: () => instance(shoppingFacade) }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LineItemEditDialogComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;

    component.lineItem = ({
      quantity: {
        value: 5,
      },
    } as unknown) as LineItemView;

    when(shoppingFacade.product$(anything(), anything())).thenReturn(
      of({
        type: 'VariationProduct',
        sku: 'SKU',
        variableVariationAttributes: [],
        availability: true,
        inStock: true,
        completenessLevel: ProductCompletenessLevel.List,
      } as VariationProductView)
    );

    when(shoppingFacade.productNotReady$(anything(), anything())).thenReturn(of(false));
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should give correct product id of variation to product id component', () => {
    fixture.detectChanges();
    expect(element.querySelector('camfil-product-id')).toMatchInlineSnapshot(`<camfil-product-id></camfil-product-id>`);
  });

  it('should display ish-components on the container', () => {
    fixture.detectChanges();
    expect(findAllCustomElements(element)).toIncludeAllMembers(['ish-input', 'camfil-product-image']);
  });

  it('should display loading-components on the container', () => {
    when(shoppingFacade.productNotReady$(anything(), anything())).thenReturn(of(true));
    fixture.detectChanges();
    expect(findAllCustomElements(element)).toIncludeAllMembers(['ish-input', 'ish-loading']);
  });
});
