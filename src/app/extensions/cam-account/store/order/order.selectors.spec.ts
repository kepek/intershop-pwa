import { TestBed } from '@angular/core/testing';

import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { StoreWithSnapshots, provideStoreSnapshots } from 'ish-core/utils/dev/ngrx-testing';

import { CamAccountStoreModule } from '../cam-account-store.module';

import { loadOrder } from './order.actions';
import { getOrderLoading } from './order.selectors';

describe('Order Selectors', () => {
  let store$: StoreWithSnapshots;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CamAccountStoreModule.forTesting('order'), CoreStoreModule.forTesting()],
      providers: [provideStoreSnapshots()],
    });

    store$ = TestBed.inject(StoreWithSnapshots);
  });

  describe('initial state', () => {
    it('should not be loading when in initial state', () => {
      expect(getOrderLoading(store$.state)).toBeFalse();
    });
  });

  describe('loadOrder', () => {
    const action = loadOrder();

    beforeEach(() => {
      store$.dispatch(action);
    });

    it('should set loading to true', () => {
      expect(getOrderLoading(store$.state)).toBeTrue();
    });
  });
});
