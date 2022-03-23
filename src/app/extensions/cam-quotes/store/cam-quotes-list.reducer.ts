import { Quote } from '../models/quote/quote.model';
import { createReducer, on } from '@ngrx/store';
import { approveQuotesSuccess, loadQuotesSuccess, rejectQuotesSuccess } from './cam-quotes.actions';

export interface CamQuotesListState {
  quotes: Quote[];
  approvedQuotesSuccess: boolean;
  rejectedQuotesSuccess: boolean;
}

export const initialState: CamQuotesListState = {
  quotes: [],
  approvedQuotesSuccess: false,
  rejectedQuotesSuccess: false
};

export const camQuotesListReducer = createReducer(
  initialState,
  on(loadQuotesSuccess, (state: CamQuotesListState, action) => {
    const { quotes } = action.payload;
    return {
      ...state,
      quotes,
      approvedQuotesSuccess: false,
      rejectedQuotesSuccess: false
    };
  }),
  on(approveQuotesSuccess, (state: CamQuotesListState) => {
    return { ...state, approvedQuotesSuccess: true };
  }),
  on(rejectQuotesSuccess, (state: CamQuotesListState) => {
    return { ...state, rejectedQuotesSuccess: true };
  })
);
