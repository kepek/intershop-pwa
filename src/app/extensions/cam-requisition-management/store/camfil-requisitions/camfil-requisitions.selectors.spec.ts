import { TestBed } from '@angular/core/testing';
import { anything } from 'ts-mockito';

import { LineItem } from 'ish-core/models/line-item/line-item.model';
import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { makeHttpError } from 'ish-core/utils/dev/api-service-utils';
import { StoreWithSnapshots, provideStoreSnapshots } from 'ish-core/utils/dev/ngrx-testing';

import { CamfilRequisition, CamfilRequisitionApproval } from '../../models/camfil-requisition/camfil-requisition.model';
import { CamRequisitionManagementStoreModule } from '../cam-requisition-management-store.module';

import {
  loadCamfilRequisition,
  loadCamfilRequisitions,
  loadCamfilRequisitionsFail,
  loadCamfilRequisitionsSuccess,
  loadCamfilRequisitionsuccess,
} from './camfil-requisitions.actions';
import {
  getCamfilRequisitions,
  getCamfilRequisitionsError,
  getCamfilRequisitionsLoading,
  selectEntities,
} from './camfil-requisitions.selectors';

describe('Camfil Requisitions Selectors', () => {
  let store$: StoreWithSnapshots;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CamRequisitionManagementStoreModule.forTesting('requisitions'), CoreStoreModule.forTesting()],
      providers: [provideStoreSnapshots()],
    });

    store$ = TestBed.inject(StoreWithSnapshots);
  });

  describe('initial state', () => {
    it('should not be loading when in initial state', () => {
      expect(getCamfilRequisitionsLoading(store$.state)).toBeFalse();
    });

    it('should not have an error when in initial state', () => {
      expect(getCamfilRequisitionsError(store$.state)).toBeUndefined();
    });

    it('should not have entities when in initial state', () => {
      expect(selectEntities(store$.state)).toBeEmpty();
    });
  });

  describe('loadCamfilRequisitions', () => {
    const action = loadCamfilRequisitions(anything());

    beforeEach(() => {
      store$.dispatch(action);
    });

    it('should set loading to true', () => {
      expect(getCamfilRequisitionsLoading(store$.state)).toBeTrue();
    });

    describe('loadCamfilRequisitionsSuccess', () => {
      const requisitions = [{ id: '1' }, { id: '2' }] as CamfilRequisition[];
      const successAction = loadCamfilRequisitionsSuccess({ requisitions });

      beforeEach(() => {
        store$.dispatch(successAction);
      });

      it('should set loading to false', () => {
        expect(getCamfilRequisitionsLoading(store$.state)).toBeFalse();
      });

      it('should not have an error when successfully loaded entities', () => {
        expect(getCamfilRequisitionsError(store$.state)).toBeUndefined();
      });

      it('should have entities when successfully loading', () => {
        expect(selectEntities(store$.state)).not.toBeEmpty();
      });
    });

    describe('loadCamfilRequisitionsFail', () => {
      beforeEach(() => {
        store$.dispatch(loadCamfilRequisitionsFail({ error: makeHttpError({ message: 'error' }) }));
      });

      it('should set loading to false', () => {
        expect(getCamfilRequisitionsLoading(store$.state)).toBeFalse();
      });

      it('should have an error when reducing', () => {
        expect(getCamfilRequisitionsError(store$.state)).toBeTruthy();
      });

      it('should not have entities when reducing error', () => {
        expect(selectEntities(store$.state)).toBeEmpty();
      });
    });
  });

  describe('loadCamfilRequisition', () => {
    const action = loadCamfilRequisition({ requisitionId: '12345' });

    beforeEach(() => {
      store$.dispatch(action);
    });

    it('should set loading to true', () => {
      expect(getCamfilRequisitionsLoading(store$.state)).toBeTrue();
    });

    describe('loadCamfilRequisitionsuccess', () => {
      const requisition = {
        id: '1',
        lineItems: [{ id: 'test', productSKU: 'sku', quantity: { value: 5 } } as LineItem],
      } as CamfilRequisition;
      const successAction = loadCamfilRequisitionsuccess({ requisition });

      beforeEach(() => {
        store$.dispatch(successAction);
      });

      it('should set loading to false', () => {
        expect(getCamfilRequisitionsLoading(store$.state)).toBeFalse();
      });

      it('should not have an error when successfully loaded entities', () => {
        expect(getCamfilRequisitionsError(store$.state)).toBeUndefined();
      });

      it('should have entities when successfully loading', () => {
        expect(selectEntities(store$.state)).not.toBeEmpty();
      });
    });

    describe('loadCamfilRequisitionFail', () => {
      beforeEach(() => {
        store$.dispatch(loadCamfilRequisitionsFail({ error: makeHttpError({ message: 'error' }) }));
      });

      it('should set loading to false', () => {
        expect(getCamfilRequisitionsLoading(store$.state)).toBeFalse();
      });

      it('should have an error when reducing', () => {
        expect(getCamfilRequisitionsError(store$.state)).toBeTruthy();
      });
    });
  });

  describe('getBuyerPendingRequisitions', () => {
    const requisitions = [
      {
        id: '1',
        lineItems: [{ id: 'test1', productSKU: 'sku1', quantity: { value: 5 } } as LineItem],
        user: { email: 'testmail@intershop.de' },
        approval: {
          statusCode: 'PENDING',
          status: 'pending',
        } as CamfilRequisitionApproval,
      } as CamfilRequisition,
      {
        id: '2',
        lineItems: [{ id: 'test2', productSKU: 'sku2', quantity: { value: 1 } } as LineItem],
        user: { email: 'testmail@intershop.de' },
        approval: {
          statusCode: 'PENDING',
          status: 'pending',
        } as CamfilRequisitionApproval,
      } as CamfilRequisition,
    ];

    beforeEach(() => {
      store$.dispatch(loadCamfilRequisitionsSuccess({ requisitions, view: 'buyer', status: 'PENDING' }));
    });

    it('should return correct buyer requisitions for the user', () => {
      expect(getCamfilRequisitions(store$.state)).toEqual(requisitions);
    });
  });
});
