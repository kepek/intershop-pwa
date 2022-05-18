import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent, MockPipe } from 'ng-mocks';

import { PricePipe } from 'ish-core/models/price/price.pipe';
import { CamfilProductImageComponent } from 'ish-shared/components/product/camfil-product-image/camfil-product-image.component';

import { QuoteLineItemTableComponent } from './quote-line-item-table.component';

describe('Quote Line Item Table Component', () => {
  let component: QuoteLineItemTableComponent;
  let fixture: ComponentFixture<QuoteLineItemTableComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MockComponent(CamfilProductImageComponent), MockPipe(PricePipe), QuoteLineItemTableComponent],
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
