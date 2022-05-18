import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { RouterTestingModule } from '@angular/router/testing';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { MockComponent } from 'ng-mocks';
import { Observable, of } from 'rxjs';
import { mock, when } from 'ts-mockito';

import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { SharedModule } from 'ish-shared/shared.module';

import { CamQuotesFacade } from '../../facades/cam-quotes.facade';
import { QuoteDetails } from '../../models/quote-details/quote-details.model';
import { CamQuotesStoreModule } from '../../store/cam-quotes-store.module';

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
  let quotesFacade: CamQuotesFacade;

  beforeEach(async () => {
    quotesFacade = mock(quotesFacade);
    when(quotesFacade.quoteDetails$).thenReturn(of({}) as Observable<QuoteDetails>);
    when(quotesFacade.quoteDetailsLoading$).thenReturn(of(false) as Observable<boolean>);

    await TestBed.configureTestingModule({
      declarations: [
        CamfilAccountQuoteDetailPageComponent,
        MockComponent(AddProductDialogComponent),
        MockComponent(QuoteCostSummaryComponent),
        MockComponent(QuoteDetailsComponent),
        MockComponent(QuoteLineItemComponent),
        MockComponent(QuoteLineItemTableComponent),
      ],
      imports: [
        CamQuotesStoreModule.forTesting(),
        CoreStoreModule.forTesting(),
        NgbModalModule,
        RouterTestingModule,
        SharedModule,
      ],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: [] },
        { provide: MatDialogRef, useValue: {} },
      ],
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
