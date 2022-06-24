import { createReducer, on } from '@ngrx/store';

import { QuoteDetails } from '../models/quote-details/quote-details.model';

import {
  approveQuote,
  approveQuoteError,
  loadQuoteDetails,
  loadQuoteDetailsSuccess,
  rejectQuote,
  rejectQuoteError,
} from './cam-quotes.actions';

export interface CamQuoteDetailState {
  quoteDetails: QuoteDetails;
  loading: boolean;
}

export const initialState: CamQuoteDetailState = {
  quoteDetails: undefined,
  loading: false,
};

export const camQuoteDetailReducer = createReducer(
  initialState,
  on(loadQuoteDetails, (state: CamQuoteDetailState) => ({ ...state, loading: true })),
  on(loadQuoteDetailsSuccess, (state: CamQuoteDetailState, action) => {
    const { quoteDetails } = action.payload;
    return { ...state, quoteDetails, loading: false };
  }),
  on(approveQuote, rejectQuote, (state: CamQuoteDetailState) => {
    console.log('reducer!');
    return { ...state, loading: true };
  }),
  on(approveQuoteError, rejectQuoteError, (state: CamQuoteDetailState) => ({ ...state, loading: false }))
);
