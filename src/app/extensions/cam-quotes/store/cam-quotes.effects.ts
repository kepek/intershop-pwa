import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { forkJoin } from 'rxjs';
import { filter, map, mergeMap } from 'rxjs/operators';

import { displaySuccessMessage } from 'ish-core/store/core/messages';
import { createOrderSuccess } from 'ish-core/store/customer/orders';
import { mapToPayload, mapToPayloadProperty } from 'ish-core/utils/operators';

import { QuoteCreatedDialogComponent } from '../components/quote-created-dialog/quote-created-dialog.component';
import { QuotesService } from '../services/quotes/quotes.service';

import {
  approveQuote,
  approveQuoteSuccess,
  approveQuotes,
  approveQuotesSuccess,
  createQuoteSuccess,
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
  constructor(private actions$: Actions, private camQuotesSrv: QuotesService, private dialog: MatDialog) {}

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

  showLightboxAfterQuoteCreated$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(createQuoteSuccess),
        map(() => this.dialog.open(QuoteCreatedDialogComponent))
      ),
    { dispatch: false }
  );

  approveCamQuote$ = createEffect(() =>
    this.actions$.pipe(
      ofType(approveQuote),
      mapToPayload(),
      mergeMap(({ request }) =>
        this.camQuotesSrv
          .approveQuote(request)
          .pipe(mergeMap(response => [approveQuoteSuccess({ response }), loadQuoteDetails({ quoteId: request.id })]))
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
          mergeMap(response => [approveQuotesSuccess({ response }), loadQuotes()])
        )
      )
    )
  );

  rejectCamQuote$ = createEffect(() =>
    this.actions$.pipe(
      ofType(rejectQuote),
      mapToPayload(),
      mergeMap(({ request, reason }) =>
        this.camQuotesSrv
          .rejectQuote(request, reason)
          .pipe(mergeMap(response => [rejectQuoteSuccess({ response }), loadQuoteDetails({ quoteId: request.id })]))
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
          ])
        )
      )
    )
  );
}
