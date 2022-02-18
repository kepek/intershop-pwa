import { TestBed } from '@angular/core/testing';
import { CamfilPwaStoreModule } from 'camfil-pwa/store/camfil-pwa-store.module';

import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { StoreWithSnapshots, provideStoreSnapshots } from 'ish-core/utils/dev/ngrx-testing';

import { loadCamfilOrder } from './camfil-orders.actions';
import { getCamfilOrdersLoading } from './camfil-orders.selectors';

describe('Camfil Orders Selectors', () => {
  let store$: StoreWithSnapshots;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CamfilPwaStoreModule.forTesting('camfilOrders'), CoreStoreModule.forTesting()],
      providers: [provideStoreSnapshots()],
    });

    store$ = TestBed.inject(StoreWithSnapshots);
  });

  describe('initial state', () => {
    it('should not be loading when in initial state', () => {
      expect(getCamfilOrdersLoading(store$.state)).toBeFalse();
    });
  });

  describe('loadOrder', () => {
    const action = loadCamfilOrder({ orderId: '1234' });

    beforeEach(() => {
      store$.dispatch(action);
    });

    it('should set loading to true', () => {
      expect(getCamfilOrdersLoading(store$.state)).toBeTrue();
    });
  });
});
