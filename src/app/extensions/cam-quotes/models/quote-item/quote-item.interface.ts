export type QuoteLineStringProps = 'productSKU';

export type QuoteLineProps = QuoteLineStringProps | 'quantity';

export interface QuoteItemData {
  type: 'Link';
  uri: string;
  title: string;
  itemId: string;
  attributes: Array<QuoteLineAttrString | QuoteLineAttrQuantity>;
}

export interface QuoteLineAttrString {
  name: QuoteLineStringProps;
  type: 'String';
  value: string;
}

export interface QuoteLineAttrQuantity {
  name: 'quantity';
  type: 'QuantityRO';
  value: Quantity;
}

export interface Quantity {
  type: 'Quantity';
  value: number;
  unit: string;
}

export interface QuoteItemCreated {
  type: string;
  uri: string;
  title: string;
}
