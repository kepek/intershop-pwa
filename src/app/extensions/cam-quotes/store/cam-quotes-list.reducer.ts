import { Quote } from '../models/quote/quote.model';
import { createReducer, on } from '@ngrx/store';
import { approveQuotesSuccess, loadQuotesSuccess } from './cam-quotes.actions';

export interface CamQuotesListState {
  quotes: Quote[];
  approvedQuotesSuccess: boolean;
}

export const initialState: CamQuotesListState = {
  quotes: [],
  approvedQuotesSuccess: false
};

export const camQuotesListReducer = createReducer(
  initialState,
  on(loadQuotesSuccess, (state: CamQuotesListState, action) => {
    const { quotes } = action.payload;
    return { ...state, quotes, approvedQuotesSuccess: false };
  }),
  on(approveQuotesSuccess, (state: CamQuotesListState, action) => {
    return { ...state, approvedQuotesSuccess: true };
  })
);
