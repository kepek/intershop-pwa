import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { forkJoin } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { displaySuccessMessage } from 'ish-core/store/core/messages';
import { mapToPayload, mapToPayloadProperty } from 'ish-core/utils/operators';

import { QuotesService } from '../services/quotes/quotes.service';

import {
  approveQuote,
  approveQuoteSuccess,
  approveQuotes,
  approveQuotesSuccess,
  loadQuoteDetails,
  loadQuoteDetailsSuccess,
  loadQuotes,
  loadQuotesSuccess,
  rejectQuote,
  rejectQuoteSuccess,
  rejectQuotes,
  rejectQuotesSuccess,
} from './cam-quotes.actions';

@Injectable()
export class CamQuotesEffects {
  constructor(private actions$: Actions, private camQuotesSrv: QuotesService) {}

  loadCamQuotes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadQuotes),
      mergeMap(() => this.camQuotesSrv.getQuotes().pipe(map(quotes => loadQuotesSuccess({ quotes }))))
    )
  );

  loadCamQuoteDetail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadQuoteDetails),
      mapToPayloadProperty('quoteId'),
      mergeMap(quoteId =>
        this.camQuotesSrv
          .getQuoteDetails(quoteId)
          .pipe(mergeMap(quoteDetails => [loadQuoteDetailsSuccess({ quoteDetails })]))
      )
    )
  );

  approveCamQuote$ = createEffect(() =>
    this.actions$.pipe(
      ofType(approveQuote),
      mapToPayload(),
      mergeMap(({ quoteId }) =>
        this.camQuotesSrv
          .approveQuote(quoteId)
          .pipe(mergeMap(response => [approveQuoteSuccess({ response }), loadQuoteDetails({ quoteId })]))
      )
    )
  );

  approveCamQuotes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(approveQuotes),
      mapToPayload(),
      mergeMap(({ quoteIds }) =>
        forkJoin(quoteIds.map(quoteId => this.camQuotesSrv.approveQuote(quoteId))).pipe(
          mergeMap(response => [approveQuotesSuccess({ response }), loadQuotes()])
        )
      )
    )
  );

  rejectCamQuote$ = createEffect(() =>
    this.actions$.pipe(
      ofType(rejectQuote),
      mapToPayload(),
      mergeMap(({ quoteId, reason }) =>
        this.camQuotesSrv
          .rejectQuote(quoteId, reason)
          .pipe(mergeMap(response => [rejectQuoteSuccess({ response }), loadQuoteDetails({ quoteId })]))
      )
    )
  );

  rejectCamQuotes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(rejectQuotes),
      mapToPayload(),
      mergeMap(({ quoteIds, reason }) =>
        forkJoin(quoteIds.map(quoteId => this.camQuotesSrv.rejectQuote(quoteId, reason))).pipe(
          mergeMap(response => [
            rejectQuotesSuccess({ response }),
            loadQuotes(),
            displaySuccessMessage({
              message: 'camfil.quotes.quoteslist.reject_quotes_modal.success',
            }),
          ])
        )
      )
    )
  );
}
