import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuoteCostSummaryComponent } from './quote-cost-summary.component';

describe('Quote Cost Summary Component', () => {
  let component: QuoteCostSummaryComponent;
  let fixture: ComponentFixture<QuoteCostSummaryComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QuoteCostSummaryComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuoteCostSummaryComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
