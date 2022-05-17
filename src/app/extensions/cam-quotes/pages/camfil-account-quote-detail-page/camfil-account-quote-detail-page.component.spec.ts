import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

import { SharedModule } from 'ish-shared/shared.module';

import { CamfilAccountQuoteDetailPageComponent } from './camfil-account-quote-detail-page.component';
import { AddProductDialogComponent } from './components/add-product-dialog/add-product-dialog.component';
import { QuoteCostSummaryComponent } from './components/quote-cost-summary/quote-cost-summary.component';
import { QuoteDetailsComponent } from './components/quote-details/quote-details.component';
import { QuoteLineItemTableComponent } from './components/quote-line-item-table/quote-line-item-table.component';
import { QuoteLineItemComponent } from './components/quote-line-item/quote-line-item.component';

describe('Camfil Account Quote Detail Page Component', () => {
  let component: CamfilAccountQuoteDetailPageComponent;
  let fixture: ComponentFixture<CamfilAccountQuoteDetailPageComponent>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AddProductDialogComponent,
        CamfilAccountQuoteDetailPageComponent,
        QuoteCostSummaryComponent,
        QuoteDetailsComponent,
        QuoteLineItemComponent,
        QuoteLineItemTableComponent,
      ],
      imports: [NgbModalModule, RouterTestingModule, SharedModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CamfilAccountQuoteDetailPageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });
});
