export enum QuoteStatus {
  Requested,
  Received,
  Approved,
  Rejected,
  Expired,
}

export type QuoteType = 'quotation' | 'proposal';

export interface Quote {
  id: string;
  type: string;
  quotationType: QuoteType;
  customerName: string;
  customerNumber: string;
  customerDepartment: string;
  camfilQuoteNumber: string;
  customerQuoteNumber: string;
  requestedBy: string;
  requestedDate: Date;
  quotationDate: Date;
  status: QuoteStatus;
  statusText: string;
  // orderChannel: 'WEB' | 'CAMFIL-WEB' | 'ERP';
  orderChannel: string;
}
