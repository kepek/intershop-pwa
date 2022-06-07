import { createAction } from '@ngrx/store';

import { payload } from 'ish-core/utils/ngrx-creators';

import { QuoteDetails } from '../models/quote-details/quote-details.model';
import { QuoteServiceRequest } from '../models/quote-service-request/quote-service-request.model';
import { QuoteServiceResponse } from '../models/quote-service-response/quote-service-response.model';
import { Quote } from '../models/quote/quote.model';

export const loadQuotes = createAction('[Cam Quotes] Load Camfil Quotes');

export const loadQuotesSuccess = createAction(
  '[Cam Quotes] Load Camfil Quotes Success',
  payload<{ quotes: Quote[] }>()
);

export const loadQuoteDetails = createAction('[Cam Quotes] Load Camfil Quote Details', payload<{ quoteId: string }>());

export const loadQuoteDetailsSuccess = createAction(
  '[Cam Quotes] Load Camfil Quote Details Success',
  payload<{ quoteDetails: QuoteDetails }>()
);

export const createQuoteSuccess = createAction('[Cam Quotes] Create Quote Success');

export const approveQuote = createAction('[Cam Quotes] Approve Quote', payload<{ request: QuoteServiceRequest }>());

export const approveQuoteSuccess = createAction(
  '[Cam Quotes] Approve Quote Success',
  payload<{ response: QuoteServiceResponse }>()
);

export const approveQuotes = createAction('[Cam Quotes] Approve Quotes', payload<{ request: QuoteServiceRequest[] }>());

export const approveQuotesSuccess = createAction(
  '[Cam Quotes] Approve Quotes Success',
  payload<{ response: QuoteServiceResponse[] }>()
);

export const rejectQuote = createAction(
  '[Cam Quotes] Reject Quote',
  payload<{ request: QuoteServiceRequest; reason: string }>()
);

export const rejectQuoteSuccess = createAction(
  '[Cam Quotes] Reject Quote Success',
  payload<{ response: QuoteServiceResponse }>()
);

export const rejectQuotes = createAction(
  '[Cam Quotes] Reject Quotes',
  payload<{ request: QuoteServiceRequest[]; reason: string }>()
);

export const rejectQuotesSuccess = createAction(
  '[Cam Quotes] Reject Quotes Success',
  payload<{ response: QuoteServiceResponse[] }>()
);
