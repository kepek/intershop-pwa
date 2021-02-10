import { createSelector } from '@ngrx/store';

import { selectRouteParam } from 'ish-core/store/core/router';
import { ShoppingState, getShoppingState } from 'ish-core/store/shopping/shopping-store';

import { SuggestSearch, searchAdapter } from './search.reducer';

const getSearchState = createSelector(getShoppingState, (state: ShoppingState) => state.search);

const { selectEntities: getSuggestSearchEntities } = searchAdapter.getSelectors(getSearchState);

export const getSearchTerm = selectRouteParam('searchTerm');

export const getSuggestSearchResults = (searchTerm: string) =>
  createSelector(getSuggestSearchEntities, entities => (entities[searchTerm] && entities[searchTerm].suggests) || []);

const { selectEntities } = searchAdapter.getSelectors(getSearchState);

export const getSearchTermFromSuggests = (searchTerm: string) =>
  createSelector(selectEntities, (entities): string => {
    const suggest = Object.values(entities).find(
      (item: SuggestSearch) =>
        Object.values(item.suggests)
          .map(el => el.term)
          .join(',')
          .toLowerCase() === searchTerm
    ) as SuggestSearch;
    return suggest?.searchTerm || searchTerm;
  });
