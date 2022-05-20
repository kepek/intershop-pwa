export type QuoteStringProps =
  | 'quotationType'
  | 'number'
  | 'name'
  | 'userFirstName'
  | 'userLastName'
  | 'customerNumber'
  | 'customerName'
  | 'customerDepartment'
  | 'ERPnumber'
  | 'orderChannel'
  | 'creationDate'
  | 'quotationDate';

export type QuoteIntegerProps = 'status';

export type QuoteProps = QuoteStringProps | QuoteIntegerProps;

export interface QuoteAttrString {
  name: QuoteStringProps;
  type: 'String';
  value: string;
}

export interface QuoteAttrInteger {
  name: QuoteIntegerProps;
  type: 'Integer';
  value: number;
}

export interface QuoteData {
  attributes: Array<QuoteAttrString | QuoteAttrInteger>;
  title: string;
  type: 'Link';
  uri: string;
}
