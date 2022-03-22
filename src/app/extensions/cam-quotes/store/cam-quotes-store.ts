import { createFeatureSelector } from '@ngrx/store';
import { CamQuotesListState } from './cam-quotes-list.reducer';
import { CamQuoteDetailState } from './cam-quote-detail.reducer';

export interface CamQuotesState {
  quotesList: CamQuotesListState;
  quoteDetails: CamQuoteDetailState;
}

export const getCamQuotesState = createFeatureSelector<CamQuotesState>('camQuotes');
