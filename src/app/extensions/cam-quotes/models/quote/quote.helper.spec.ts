import { QuoteHelper } from './quote.helper';
import { Quote } from './quote.model';

describe('Quote Helper', () => {
  describe('equal', () => {
    it.each([
      [false, undefined, undefined],
      [false, { id: 'test' } as Quote, undefined],
      [false, undefined, { id: 'test' } as Quote],
      [false, { id: 'test' } as Quote, { id: 'other' } as Quote],
      [true, { id: 'test' } as Quote, { id: 'test' } as Quote],
    ])(`should return %s when comparing %j and %j`, (expected, o1, o2) => {
      expect(QuoteHelper.equal(o1, o2)).toEqual(expected);
    });
  });
});
