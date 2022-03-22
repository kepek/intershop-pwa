export interface QuoteItem {
  id: string;
  title: string;
  uri: string;
  productSKU: string;
  quantity: {
    value: number;
    unit: string;
  };
}
