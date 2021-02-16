import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { cold, hot } from 'jest-marbles';
import { Observable } from 'rxjs';

import { loadOrder } from './order.actions';
import { OrderEffects } from './order.effects';

describe('Order Effects', () => {
  let actions$: Observable<Action>;
  let effects: OrderEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OrderEffects, provideMockActions(() => actions$)],
    });

    effects = TestBed.inject(OrderEffects);
  });

  describe('loadOrder$', () => {
    it('should not dispatch actions when encountering loadOrder', () => {
      const action = loadOrder();
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('------');

      expect(effects.loadOrder$).toBeObservable(expected$);
    });
  });
});
