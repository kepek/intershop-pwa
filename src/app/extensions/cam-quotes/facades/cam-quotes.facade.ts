import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import { QuoteDetails } from '../models/quote-details/quote-details.model';
import { QuoteServiceRequest } from '../models/quote-service-request/quote-service-request.model';
import { Quote } from '../models/quote/quote.model';
import {
  approveQuote,
  approveQuotes,
  loadQuoteDetails,
  loadQuotes,
  rejectQuote,
  rejectQuotes,
} from '../store/cam-quotes.actions';
import {
  getCamQuoteDetails,
  getCamQuoteDetailsLoading,
  getCamQuotesApprovedSuccess,
  getCamQuotesList,
  getCamQuotesListActionsLoading,
  getCamQuotesRejectedSuccess,
} from '../store/cam-quotes.selectors';

// tslint:disable:member-ordering
@Injectable({ providedIn: 'root' })
export class CamQuotesFacade {
  quotes$: Observable<Quote[]> = this.store.pipe(select(getCamQuotesList));
  quotesActionsLoading$: Observable<boolean> = this.store.pipe(select(getCamQuotesListActionsLoading));
  quoteDetails$: Observable<QuoteDetails> = this.store.pipe(select(getCamQuoteDetails));
  quoteDetailsLoading$: Observable<boolean> = this.store.pipe(select(getCamQuoteDetailsLoading));

  approvedQuotesSuccess$: Observable<boolean> = this.store.pipe(select(getCamQuotesApprovedSuccess));
  rejectedQuotesSuccess$: Observable<boolean> = this.store.pipe(select(getCamQuotesRejectedSuccess));

  constructor(private store: Store) {}

  loadQuotes(): void {
    this.store.dispatch(loadQuotes());
  }

  loadQuoteDetails(quoteId: string): void {
    this.store.dispatch(loadQuoteDetails({ quoteId }));
  }

  approveQuote(request: QuoteServiceRequest): void {
    this.store.dispatch(approveQuote({ request }));
  }

  approveQuotes(request: QuoteServiceRequest[]): void {
    this.store.dispatch(approveQuotes({ request }));
  }

  rejectQuote(request: QuoteServiceRequest, reason: string): void {
    this.store.dispatch(rejectQuote({ request, reason }));
  }

  rejectQuotes(request: QuoteServiceRequest[], reason: string): void {
    this.store.dispatch(rejectQuotes({ request, reason }));
  }
}
