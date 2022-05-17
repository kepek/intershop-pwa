import { createFeatureSelector } from '@ngrx/store';

import { CamQuoteDetailState } from './cam-quote-detail.reducer';
import { CamQuotesListState } from './cam-quotes-list.reducer';

export interface CamQuotesState {
  quotesList: CamQuotesListState;
  quoteDetails: CamQuoteDetailState;
}

export const getCamQuotesState = createFeatureSelector<CamQuotesState>('camQuotes');
