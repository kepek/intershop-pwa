import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import { QuoteDetails } from '../models/quote-details/quote-details.model';
import { Quote } from '../models/quote/quote.model';
import { createQuoteItem, deleteQuoteItem, loadQuoteDetails, loadQuotes } from '../store/cam-quotes.actions';
import { getCamQuoteDetails, getCamQuoteDetailsLoading, getCamQuotesList } from '../store/cam-quotes.selectors';

// tslint:disable:member-ordering
@Injectable({ providedIn: 'root' })
export class CamQuotesFacade {
  quotes$: Observable<Quote[]> = this.store.pipe(select(getCamQuotesList));
  quoteDetails$: Observable<QuoteDetails> = this.store.pipe(select(getCamQuoteDetails));
  // quoteItems$: Observable<QuoteItem[]> = this.store.pipe(select(getCamQuoteItems));
  quoteDetailsLoading$: Observable<boolean> = this.store.pipe(select(getCamQuoteDetailsLoading));

  constructor(private store: Store) {}

  loadQuotes(): void {
    this.store.dispatch(loadQuotes());
  }

  loadQuoteDetails(quoteId: string): void {
    this.store.dispatch(loadQuoteDetails({ quoteId }));
  }

  createQuoteItem(quoteId: string, data: any): void {
    this.store.dispatch(createQuoteItem({ quoteId, data }));
  }

  deleteQuoteItem(quoteId: string, quoteItemId: string): void {
    this.store.dispatch(deleteQuoteItem({ quoteId, quoteItemId }));
  }
}
