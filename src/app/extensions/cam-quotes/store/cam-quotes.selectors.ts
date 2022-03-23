import { createSelector } from '@ngrx/store';

import { CamQuoteDetailState, initialState as camQuoteDetailsInitialState } from './cam-quote-detail.reducer';
import { CamQuotesListState, initialState as camQuotesListInitialState } from './cam-quotes-list.reducer';
import { CamQuotesState, getCamQuotesState } from './cam-quotes-store';

export const getCamQuotesListState = createSelector(getCamQuotesState, (state: CamQuotesState) =>
  state ? state.quotesList : camQuotesListInitialState
);

export const getCamQuoteDetailsState = createSelector(getCamQuotesState, (state: CamQuotesState) =>
  state ? state.quoteDetails : camQuoteDetailsInitialState
);

export const getCamQuotesList = createSelector(getCamQuotesListState, (state: CamQuotesListState) => state.quotes);

export const getCamQuoteDetails = createSelector(
  getCamQuoteDetailsState,
  (state: CamQuoteDetailState) => state.quoteDetails
);

// export const getCamQuoteItems = createSelector(
//   getCamQuoteDetailsState,
//   (state: CamQuoteDetailState) => state.quoteItems
// );

export const getCamQuoteDetailsLoading = createSelector(
  getCamQuoteDetailsState,
  (state: CamQuoteDetailState) => state.loading
);

export const getCamQuotesApprovedSuccess = createSelector(
  getCamQuotesListState,
  (state: CamQuotesListState) => state.approvedQuotesSuccess
);
