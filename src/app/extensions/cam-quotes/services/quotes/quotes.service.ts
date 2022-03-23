import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { debounceTime, defaultIfEmpty, map } from 'rxjs/operators';

import { ApiService, unpackEnvelope } from 'ish-core/services/api/api.service';

import { QuoteDetailsData } from '../../models/quote-details/quote-details.interface';
import { QuoteDetailsMapper } from '../../models/quote-details/quote-details.mapper';
import { QuoteDetails } from '../../models/quote-details/quote-details.model';
import { QuoteData } from '../../models/quote/quote.interface';
import { QuoteMapper } from '../../models/quote/quote.mapper';
import { Quote } from '../../models/quote/quote.model';
import { QuoteItem } from '../../models/quote-item/quote-item.model';
import { QuoteItemCreated, QuoteItemData } from '../../models/quote-item/quote-item.interface';
import { QuoteItemMapper } from '../../models/quote-item/quote-item.mapper';

@Injectable({
  providedIn: 'root',
})
export class QuotesService {
  private quotesListAttr = [
    'number',
    'name',
    'userFirstName',
    'userLastName',
    'customerNumber',
    'customerName',
    'customerDepartment',
    'ERPnumber',
    'status',
    'creationDate',
    'orderChannel',
  ];

  constructor(
    private apiSrv: ApiService,
    private quoteDetailMapper: QuoteDetailsMapper,
    private itemsMapper: QuoteItemMapper
  ) { }

  getQuotes(): Observable<Quote[]> {
    const params = {
      attrs: this.quotesListAttr.join(','),
    };
    return this.apiSrv
      .b2bUserEndpoint()
      .get('camfilquotation', { params: new HttpParams({ fromObject: params }) })
      .pipe(
        unpackEnvelope(),
        map((quotes: QuoteData[]) => quotes.map(quoteData => new QuoteMapper().fromData(quoteData))),
        defaultIfEmpty([]),
      );
  }

  getQuoteDetails(quoteId: string): Observable<QuoteDetails> {
    return this.apiSrv
      .b2bUserEndpoint()
      .get<QuoteDetailsData>(`camfilquotation/${quoteId}`)
      .pipe(map((data: QuoteDetailsData) => this.quoteDetailMapper.fromData(data)));
  }

  getQuoteItems(quoteId: string): Observable<QuoteItem[]> {
    return this.apiSrv
      .b2bUserEndpoint()
      .get<QuoteItemData>(`camfilquotation/${quoteId}/items`)
      .pipe(
        unpackEnvelope(),
        map((items: QuoteItemData[]) => items.map(itemData => this.itemsMapper.fromData(itemData))),
      );
  }

  createQuoteItem(quoteId: string, data: any): Observable<QuoteItemCreated> {
    return this.apiSrv.b2bUserEndpoint().post<QuoteItemCreated>(`camfilquotation/${quoteId}/items`, data);
  }

  deleteQuoteItem(quoteId: string, quoteItemId: string): Observable<any> {
    return this.apiSrv.b2bUserEndpoint().delete<QuoteItemCreated>(`camfilquotation/${quoteId}/items/${quoteItemId}`);
  }

  approveQuote(quoteId: string): Observable<any> {
    // TODO: Waiting for real api call
    // return this.apiSrv.b2bUserEndpoint().post<QuoteItemCreated>(`camfilquotation/${quoteId}/approve`);
    return of({ id: quoteId }).pipe(debounceTime(250));
  }
}
