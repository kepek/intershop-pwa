import { Price } from 'ish-core/models/price/price.model';

export interface QuoteSurchargeItem {
  amount: Price;
  displayName: string;
  strikethrough?: boolean;
  bold?: boolean;
}
