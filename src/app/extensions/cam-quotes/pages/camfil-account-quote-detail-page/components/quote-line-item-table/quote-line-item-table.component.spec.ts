import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { provideMockStore } from '@ngrx/store/testing';
import { MockComponent, MockPipe } from 'ng-mocks';
import { of } from 'rxjs';
import { anything, mock, when } from 'ts-mockito';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { PricePipe } from 'ish-core/models/price/price.pipe';
import { ProductView } from 'ish-core/models/product-view/product-view.model';
import { CamfilProductImageComponent } from 'ish-shared/components/product/camfil-product-image/camfil-product-image.component';

import { QuoteLineItemTableComponent } from './quote-line-item-table.component';

describe('Quote Line Item Table Component', () => {
  let component: QuoteLineItemTableComponent;
  let fixture: ComponentFixture<QuoteLineItemTableComponent>;
  let element: HTMLElement;
  let shoppingFacade: ShoppingFacade;

  beforeEach(async () => {
    shoppingFacade = mock(ShoppingFacade);

    when(shoppingFacade.product$(anything(), anything())).thenReturn(of({} as ProductView));

    await TestBed.configureTestingModule({
      declarations: [MockComponent(CamfilProductImageComponent), MockPipe(PricePipe), QuoteLineItemTableComponent],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: [] },
        { provide: MatDialogRef, useValue: {} },
        provideMockStore({}),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuoteLineItemTableComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
