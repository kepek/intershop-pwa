import { createReducer, on } from '@ngrx/store';

import { QuoteDetails } from '../models/quote-details/quote-details.model';

import { createQuoteItem, deleteQuoteItem, loadQuoteDetails, loadQuoteDetailsSuccess } from './cam-quotes.actions';

export interface CamQuoteDetailState {
  quoteDetails: QuoteDetails;
  // quoteItems: QuoteItem[];
  loading: boolean;
}

export const initialState: CamQuoteDetailState = {
  quoteDetails: undefined,
  // quoteItems: [],
  loading: false,
};

export const camQuoteDetailReducer = createReducer(
  initialState,
  on(loadQuoteDetails, createQuoteItem, deleteQuoteItem, (state: CamQuoteDetailState) => ({ ...state, loading: true })),
  on(loadQuoteDetailsSuccess, (state: CamQuoteDetailState, action) => {
    const { quoteDetails } = action.payload;
    return { ...state, quoteDetails, loading: false };
  })
);
