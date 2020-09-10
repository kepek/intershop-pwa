import * as using from 'jasmine-data-provider';

import { DemoHelper } from './demo.helper';
import { Demo } from './demo.model';

describe('Demo Helper', () => {
  describe('equal', () => {
    using(
      [
        { o1: undefined, o2: undefined, expected: false },
        { o1: { id: 'test' } as Demo, o2: undefined, expected: false },
        { o1: undefined, o2: { id: 'test' } as Demo, expected: false },
        { o1: { id: 'test' } as Demo, o2: { id: 'other' } as Demo, expected: false },
        { o1: { id: 'test' } as Demo, o2: { id: 'test' } as Demo, expected: true },
      ],
      slice => {
        it(`should return ${slice.expected} when comparing ${JSON.stringify(slice.o1)} and ${JSON.stringify(
          slice.o2
        )}`, () => {
          expect(DemoHelper.equal(slice.o1, slice.o2)).toEqual(slice.expected);
        });
      }
    );
  });
});
