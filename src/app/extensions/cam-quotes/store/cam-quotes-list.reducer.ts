import { Quote } from '../models/quote/quote.model';
import { createReducer, on } from '@ngrx/store';
import { loadQuotesSuccess } from './cam-quotes.actions';

export interface CamQuotesListState {
  quotes: Quote[];
}

export const initialState: CamQuotesListState = {
  quotes: [],
};

export const camQuotesListReducer = createReducer(
  initialState,
  on(loadQuotesSuccess, (state: CamQuotesListState, action) => {
    const { quotes } = action.payload;
    return { ...state, quotes };
  })
);
