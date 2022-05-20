import { Quote } from './quote.model';

export class QuoteHelper {
  static equal(quote1: Quote, quote2: Quote): boolean {
    return !!quote1 && !!quote2 && quote1.id === quote2.id;
  }
}
