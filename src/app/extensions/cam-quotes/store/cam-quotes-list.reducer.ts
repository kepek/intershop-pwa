import { createReducer, on } from '@ngrx/store';

import { Quote } from '../models/quote/quote.model';

import {
  approveQuotes,
  approveQuotesError,
  approveQuotesSuccess,
  loadQuotesSuccess,
  rejectQuotes,
  rejectQuotesError,
  rejectQuotesSuccess,
} from './cam-quotes.actions';

export interface CamQuotesListState {
  quotes: Quote[];
  approvedQuotesSuccess: boolean;
  rejectedQuotesSuccess: boolean;
  actionsLoading: boolean;
}

export const initialState: CamQuotesListState = {
  quotes: [],
  approvedQuotesSuccess: false,
  rejectedQuotesSuccess: false,
  actionsLoading: false,
};

export const camQuotesListReducer = createReducer(
  initialState,
  on(loadQuotesSuccess, (state: CamQuotesListState, action) => {
    const { quotes } = action.payload;
    return {
      ...state,
      quotes,
      approvedQuotesSuccess: false,
      rejectedQuotesSuccess: false,
    };
  }),
  on(approveQuotes, rejectQuotes, (state: CamQuotesListState) => ({ ...state, actionsLoading: true })),
  on(approveQuotesSuccess, (state: CamQuotesListState) => ({
    ...state,
    approvedQuotesSuccess: true,
    actionsLoading: false,
  })),
  on(rejectQuotesSuccess, (state: CamQuotesListState) => ({
    ...state,
    rejectedQuotesSuccess: true,
    actionsLoading: false,
  })),
  on(approveQuotesError, rejectQuotesError, (state: CamQuotesListState) => ({ ...state, actionsLoading: false }))
);
