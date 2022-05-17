import { TestBed } from '@angular/core/testing';

import { QuoteData } from './quote.interface';
import { QuoteMapper } from './quote.mapper';

describe('Quote Mapper', () => {
  let quoteMapper: QuoteMapper;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    quoteMapper = TestBed.inject(QuoteMapper);
  });

  describe('fromData', () => {
    it('should throw when input is falsy', () => {
      expect(() => quoteMapper.fromData(undefined)).toThrow();
    });

    it('should map incoming data to model data', () => {
      const data: QuoteData = {
        title: '3',
        attributes: [
          {
            name: 'creationDate',
            value: '1995-12-17T13:24:00',
            type: 'String',
          },
          {
            name: 'quotationDate',
            value: '1995-12-17T13:24:00',
            type: 'String',
          },
        ],
        type: 'Link',
        uri: '',
      };
      const mapped = quoteMapper.fromData(data);
      expect(mapped).toHaveProperty('id', '3');
      expect(mapped.requestedDate).toBeDate();
      expect(mapped.quotationDate).toBeDate();
    });
  });
});
