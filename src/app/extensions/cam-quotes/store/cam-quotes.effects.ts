import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { QuotesService } from '../services/quotes/quotes.service';
import {
  createQuoteItem,
  createQuoteItemSuccess, deleteQuoteItem, deleteQuoteItemSuccess,
  loadQuoteDetails,
  loadQuoteDetailsSuccess,
  loadQuotes,
  loadQuotesSuccess,
} from './cam-quotes.actions';
import { map, mergeMap } from 'rxjs/operators';
import { mapToPayload, mapToPayloadProperty } from 'ish-core/utils/operators';

@Injectable()
export class CamQuotesEffects {
  constructor(private actions$: Actions, private camQuotesSrv: QuotesService) {
  }

  loadCamQuotes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadQuotes),
      mergeMap(() => {
        return this.camQuotesSrv.getQuotes().pipe(
          map(quotes => loadQuotesSuccess({ quotes })),
        );
      })
    )
  );

  loadCamQuoteDetail$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(loadQuoteDetails),
      mapToPayloadProperty('quoteId'),
      mergeMap(quoteId => {
        return this.camQuotesSrv.getQuoteDetails(quoteId)
          .pipe(
            mergeMap(quoteDetails => [
              loadQuoteDetailsSuccess({ quoteDetails })
            ]),
          );
      }),
    );
  });

  createCamQuoteItem$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(createQuoteItem),
      mapToPayload(),
      mergeMap(({ quoteId, data }) => {
        return this.camQuotesSrv
          .createQuoteItem(quoteId, data)
          .pipe(mergeMap(response => [
            createQuoteItemSuccess({ response }),
            loadQuoteDetails({ quoteId }),
          ]));
      }),
    );
  });

  deleteCamQuoteItem$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(deleteQuoteItem),
      mapToPayload(),
      mergeMap(({ quoteId, quoteItemId }) => {
        return this.camQuotesSrv.deleteQuoteItem(quoteId, quoteItemId)
          .pipe(mergeMap(response => [
            deleteQuoteItemSuccess({ response }),
            loadQuoteDetails({ quoteId })
          ]));
      })
    );
  });
}
