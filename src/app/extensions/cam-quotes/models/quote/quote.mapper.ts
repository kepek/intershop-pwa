import { Injectable } from '@angular/core';

import { QuoteData, QuoteIntegerProps, QuoteProps, QuoteStringProps } from './quote.interface';
import { Quote, QuoteStatus, QuoteType } from './quote.model';

@Injectable({ providedIn: 'root' })
export class QuoteMapper {
  fromData(quoteData: QuoteData): Quote {
    if (quoteData) {
      const statusId = this.getPropFromData(quoteData, 'status');
      const requestedDate = this.getPropFromData(quoteData, 'creationDate');
      const quotationDate = this.getPropFromData(quoteData, 'quotationDate');
      return {
        id: quoteData.title,
        type: 'quotation',
        quotationType: this.getPropFromData(quoteData, 'quotationType'),
        customerName: this.getPropFromData(quoteData, 'customerName'),
        customerNumber: this.getPropFromData(quoteData, 'customerNumber'),
        customerDepartment: this.getPropFromData(quoteData, 'customerDepartment'),
        camfilQuoteNumber: this.getPropFromData(quoteData, 'ERPnumber'),
        customerQuoteNumber: this.getPropFromData(quoteData, 'number'),
        requestedBy: `${this.getPropFromData(quoteData, 'userFirstName')} ${this.getPropFromData(
          quoteData,
          'userLastName'
        )}`,
        requestedDate: requestedDate ? new Date(requestedDate) : undefined,
        quotationDate: quotationDate ? new Date(quotationDate) : undefined,
        status: statusId,
        statusText: this.getStatusText(statusId),
        orderChannel: this.getPropFromData(quoteData, 'orderChannel'),
      };
    } else {
      throw new Error(`quoteData is required`);
    }
  }

  private getPropFromData(data: QuoteData, prop: 'quotationType'): QuoteType | undefined;
  private getPropFromData(data: QuoteData, prop: QuoteStringProps): string | undefined;
  private getPropFromData(data: QuoteData, prop: QuoteIntegerProps): number | undefined;
  private getPropFromData(data: QuoteData, prop: QuoteProps): string | number | undefined {
    const attr = data.attributes.find(attribute => attribute.name === prop);
    return attr?.value;
  }

  private getStatusText(statusId: number): string {
    return QuoteStatus[statusId];
  }
}
