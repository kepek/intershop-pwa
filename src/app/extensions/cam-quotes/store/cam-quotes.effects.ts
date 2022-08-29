import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { forkJoin } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';

import { displayErrorMessage, displaySuccessMessage } from 'ish-core/store/core/messages';
import { createOrderSuccess } from 'ish-core/store/customer/orders';
import { mapErrorToAction, mapToPayload, mapToPayloadProperty } from 'ish-core/utils/operators';

import { QuotesService } from '../services/quotes/quotes.service';

import {
  approveQuote,
  approveQuoteError,
  approveQuoteSuccess,
  approveQuotes,
  approveQuotesError,
  approveQuotesSuccess,
  createQuoteSuccess,
  loadQuoteDetails,
  loadQuoteDetailsSuccess,
  loadQuotes,
  loadQuotesSuccess,
  rejectQuote,
  rejectQuoteError,
  rejectQuoteSuccess,
  rejectQuotes,
  rejectQuotesError,
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

  createQuoteSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createOrderSuccess),
      mapToPayloadProperty('order'),
      filter(order => order && order.statusCode === 'RFQ'),
      map(createQuoteSuccess)
    )
  );

  approveCamQuote$ = createEffect(() =>
    this.actions$.pipe(
      ofType(approveQuote),
      mapToPayload(),
      mergeMap(({ request }) =>
        this.camQuotesSrv.approveQuote(request).pipe(
          mergeMap(response => [approveQuoteSuccess({ response }), loadQuoteDetails({ quoteId: request.id })]),
          mapErrorToAction(approveQuoteError)
        )
      )
    )
  );

  approveCamQuoteError$ = createEffect(() =>
    this.actions$.pipe(
      ofType(approveQuoteError),
      map(() =>
        displayErrorMessage({
          message: 'camfil.quotes.quoteslist.approve_quote_error',
          duration: 3000,
        })
      )
    )
  );

  approveCamQuoteSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(approveQuoteSuccess),
      map(() =>
        displaySuccessMessage({
          message: 'camfil.quotes.quoteslist.approve_quote_success',
        })
      )
    )
  );

  approveCamQuotes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(approveQuotes),
      mapToPayload(),
      mergeMap(({ request }) =>
        forkJoin(request.map(r => this.camQuotesSrv.approveQuote(r))).pipe(
          mergeMap(response => [approveQuotesSuccess({ response }), loadQuotes()]),
          mapErrorToAction(approveQuotesError)
        )
      )
    )
  );

  approveCamQuotesError$ = createEffect(() =>
    this.actions$.pipe(
      ofType(approveQuotesError),
      map(() =>
        displayErrorMessage({
          message: 'camfil.quotes.quoteslist.approve_quotes_error',
          duration: 3000,
        })
      )
    )
  );

  rejectCamQuote$ = createEffect(() =>
    this.actions$.pipe(
      ofType(rejectQuote),
      mapToPayload(),
      mergeMap(({ request, reason }) =>
        this.camQuotesSrv.rejectQuote(request, reason).pipe(
          mergeMap(response => [rejectQuoteSuccess({ response }), loadQuoteDetails({ quoteId: request.id })]),
          mapErrorToAction(rejectQuoteError)
        )
      )
    )
  );

  rejectCamQuoteError$ = createEffect(() =>
    this.actions$.pipe(
      ofType(rejectQuoteError),
      map(() =>
        displayErrorMessage({
          message: 'camfil.quotes.quoteslist.reject_quote_error',
          duration: 3000,
        })
      )
    )
  );

  rejectCamQuoteSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(rejectQuoteSuccess),
      map(() =>
        displaySuccessMessage({
          message: 'camfil.quotes.quoteslist.reject_quote_success',
        })
      )
    )
  );

  rejectCamQuotes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(rejectQuotes),
      mapToPayload(),
      mergeMap(({ request, reason }) =>
        forkJoin(request.map(r => this.camQuotesSrv.rejectQuote(r, reason))).pipe(
          mergeMap(response => [
            rejectQuotesSuccess({ response }),
            loadQuotes(),
            displaySuccessMessage({
              message: 'camfil.quotes.quoteslist.reject_quotes_modal.success',
            }),
          ]),
          mapErrorToAction(rejectQuotesError)
        )
      )
    )
  );

  rejectCamQuotesError$ = createEffect(() =>
    this.actions$.pipe(
      ofType(rejectQuotesError),
      map(() =>
        displayErrorMessage({
          message: 'camfil.quotes.quoteslist.reject_quotes_error',
          duration: 3000,
        })
      )
    )
  );
}
