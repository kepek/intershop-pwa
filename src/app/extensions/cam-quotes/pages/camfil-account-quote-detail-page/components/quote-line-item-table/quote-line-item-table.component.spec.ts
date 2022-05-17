import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuoteLineItemTableComponent } from './quote-line-item-table.component';

describe('Quote Line Item Table Component', () => {
  let component: QuoteLineItemTableComponent;
  let fixture: ComponentFixture<QuoteLineItemTableComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QuoteLineItemTableComponent],
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
