import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { ActionReducerMap, StoreModule } from '@ngrx/store';
import { pick } from 'lodash-es';

import { CamQuotesState } from './cam-quotes-store';
import { CamQuotesEffects } from './cam-quotes.effects';
import { camQuotesListReducer } from './cam-quotes-list.reducer';
import { camQuoteDetailReducer } from './cam-quote-detail.reducer';

const camQuotesReducers: ActionReducerMap<CamQuotesState> = {
  quotesList: camQuotesListReducer,
  quoteDetails: camQuoteDetailReducer,
};

const camQuotesEffects = [CamQuotesEffects];

// not-dead-code
@NgModule({
  imports: [EffectsModule.forFeature(camQuotesEffects), StoreModule.forFeature('camQuotes', camQuotesReducers)],
})
export class CamQuotesStoreModule {
  static forTesting(...reducers: (keyof ActionReducerMap<CamQuotesState>)[]) {
    return StoreModule.forFeature('camQuotes', pick(camQuotesReducers, reducers));
  }
}
