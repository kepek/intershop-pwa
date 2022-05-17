import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuoteLineItemComponent } from './quote-line-item.component';

describe('Quote Line Item Component', () => {
  let component: QuoteLineItemComponent;
  let fixture: ComponentFixture<QuoteLineItemComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QuoteLineItemComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuoteLineItemComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
