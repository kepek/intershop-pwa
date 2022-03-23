import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { displaySuccessMessage } from 'ish-core/store/core/messages';
import { QuotesService } from '../services/quotes/quotes.service';
import {
  approveQuote,
  approveQuotes,
  approveQuotesSuccess,
  approveQuoteSuccess,
  createQuoteItem,
  createQuoteItemSuccess, deleteQuoteItem, deleteQuoteItemSuccess,
  loadQuoteDetails,
  loadQuoteDetailsSuccess,
  loadQuotes,
  loadQuotesSuccess,
  rejectQuote,
  rejectQuotes,
  rejectQuotesSuccess,
  rejectQuoteSuccess,
} from './cam-quotes.actions';
import { map, mergeMap } from 'rxjs/operators';
import { mapToPayload, mapToPayloadProperty } from 'ish-core/utils/operators';
import { forkJoin } from 'rxjs';

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

  approveCamQuote$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(approveQuote),
      mapToPayload(),
      mergeMap(({ quoteId }) => {
        return this.camQuotesSrv.approveQuote(quoteId)
          .pipe(mergeMap(response => [
            approveQuoteSuccess({ response }),
            loadQuoteDetails({ quoteId })
          ]))
      }),
    )
  });

  approveCamQuotes$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(approveQuotes),
      mapToPayload(),
      mergeMap(({ quoteIds }) => {
        return forkJoin(
          quoteIds.map(quoteId => this.camQuotesSrv.approveQuote(quoteId))
        ).pipe(mergeMap(response => [
          approveQuotesSuccess({ response }),
          loadQuotes()
        ]))
      }),
    )
  });

  rejectCamQuote$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(rejectQuote),
      mapToPayload(),
      mergeMap(({ quoteId, reason }) => {
        return this.camQuotesSrv.rejectQuote(quoteId, reason)
          .pipe(mergeMap(response => [
            rejectQuoteSuccess({ response }),
            loadQuoteDetails({ quoteId })
          ]))
      }),
    )
  });

  rejectCamQuotes$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(rejectQuotes),
      mapToPayload(),
      mergeMap(({ quoteIds, reason }) => {
        return forkJoin(
          quoteIds.map(quoteId => this.camQuotesSrv.rejectQuote(quoteId, reason))
        ).pipe(mergeMap(response => [
          rejectQuotesSuccess({ response }),
          loadQuotes(),
          displaySuccessMessage({
            message: 'camfil.quotes.quoteslist.reject_quotes_modal.success'
          }),
        ]))
      }),
    )
  });
}
