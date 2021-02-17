import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';

import { SuggestTerm } from 'ish-core/models/suggest-term/suggest-term.model';

import { setCurrentTerm, suggestSearchSuccess } from './search.actions';

export interface SuggestSearch {
  searchTerm: string;
  suggests: SuggestTerm[];
}

export const searchAdapter = createEntityAdapter<SuggestSearch>({
  selectId: search => search.searchTerm,
});

export interface SearchState extends EntityState<SuggestSearch> {
  currentTerm: string;
}

const initialState: SearchState = searchAdapter.getInitialState({
  currentTerm: '',
});

export const searchReducer = createReducer(
  initialState,
  on(suggestSearchSuccess, (state: SearchState, action) => searchAdapter.upsertOne(action.payload, state)),
  on(setCurrentTerm, (state: SearchState, action) => ({
    ...state,
    currentTerm: action.payload.searchTerm,
  }))
);
