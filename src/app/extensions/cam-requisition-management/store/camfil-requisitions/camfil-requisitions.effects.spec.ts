import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, StoreModule } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { anyString, instance, mock, verify, when } from 'ts-mockito';

import { LineItem } from 'ish-core/models/line-item/line-item.model';

import { CamfilRequisition } from '../../models/camfil-requisition/camfil-requisition.model';
import { CamfilRequisitionsService } from '../../services/requisitions/camfil-requisitions.service';

import {
  getCamfilRequisitionData,
  loadCamfilRequisitions,
  loadCamfilRequisitionsuccess,
  updateCamfilRequisitionStatus,
} from './camfil-requisitions.actions';
import { CamfilRequisitionsEffects } from './camfil-requisitions.effects';

@Component({ template: 'dummy' })
class DummyComponent {}

const requisitions = [
  {
    id: 'testUUID',
    requisitionNo: '0001',
    user: { firstName: 'Patricia', lastName: 'Miller' },
    approval: { status: 'pending', statusCode: 'PENDING' },
    lineItems: [
      ({
        id: 'BIID',
        name: 'NAME',
        position: 1,
        quantity: { value: 1 },
        price: undefined,
        productSKU: 'SKU',
      } as unknown) as LineItem,
    ],
  },
  {
    id: 'testUUID2',
    requisitionNo: '0002',
    user: { firstName: 'Jack', lastName: 'Miller' },
    approval: { status: 'pending', statusCode: 'PENDING' },
  },
] as CamfilRequisition[];

describe('Camfil Requisitions Effects', () => {
  let actions$: Observable<Action>;
  let effects: CamfilRequisitionsEffects;
  let requisitionsService: CamfilRequisitionsService;

  beforeEach(() => {
    requisitionsService = mock(CamfilRequisitionsService);
    when(requisitionsService.getCamfilRequisitions()).thenReturn(of(requisitions));
    when(requisitionsService.getCamfilRequisition(anyString())).thenReturn(of(requisitions[0]));
    when(requisitionsService.updateCamfilRequisitionStatus(anyString(), anyString(), anyString())).thenReturn(
      of(requisitions[0])
    );

    TestBed.configureTestingModule({
      declarations: [DummyComponent],
      imports: [RouterTestingModule.withRoutes([{ path: '**', component: DummyComponent }]), StoreModule.forRoot({})],
      providers: [
        CamfilRequisitionsEffects,
        provideMockActions(() => actions$),
        { provide: CamfilRequisitionsService, useFactory: () => instance(requisitionsService) },
      ],
    });
    effects = TestBed.inject(CamfilRequisitionsEffects);
  });

  describe('loadCamfilRequisitions$', () => {
    it('should call the service for retrieving requisitions', done => {
      actions$ = of(loadCamfilRequisitions());

      effects.loadCamfilRequisitions$.subscribe(() => {
        verify(requisitionsService.getCamfilRequisitions()).once();
        done();
      });
    });

    it('should retrieve requisitions when triggered', done => {
      actions$ = of(loadCamfilRequisitions());

      effects.loadCamfilRequisitions$.subscribe(action => {
        expect(action).toMatchInlineSnapshot(`
          [Camfil Requisitions API] Load Requisitions Success:
            requisitions: [{"id":"testUUID","requisitionNo":"0001","user":{"firstName"...
        `);
        done();
      });
    });
  });

  describe('loadCamfilRequisition$', () => {
    it('should call the service  for retrieving a requisition', done => {
      actions$ = of(getCamfilRequisitionData({ requisitionId: '12345' }));

      effects.getCamfilRequisitionData$.subscribe(() => {
        verify(requisitionsService.getCamfilRequisition('12345')).once();
        done();
      });
    });

    it('should retrieve a requisition when triggered', done => {
      actions$ = of(getCamfilRequisitionData({ requisitionId: '12345' }));

      effects.getCamfilRequisitionData$.subscribe(action => {
        expect(action).toMatchInlineSnapshot(`
          [Camfil Requisitions API] Load Requisition Success:
            requisition: {"id":"testUUID","requisitionNo":"0001","user":{"firstName":...
        `);
        done();
      });
    });

    it('should load products of a requisition if there are not loaded yet', done => {
      actions$ = of(loadCamfilRequisitionsuccess({ requisition: requisitions[0] }));

      effects.loadProductsForSelectedRequisition$.subscribe(action => {
        expect(action).toMatchInlineSnapshot(`
          [Products Internal] Load Product if not Loaded:
            sku: "SKU"
            level: 2
        `);
        done();
      });
    });
  });

  describe('updateCamfilRequisitionStatus$', () => {
    it('should call the service for updating the status of a requisition', done => {
      actions$ = of(
        updateCamfilRequisitionStatus({
          requisitionId: '4711',
          status: 'APPROVED',
          approvalComment: 'test comment',
        })
      );

      effects.updateCamfilRequisitionStatus$.subscribe(() => {
        verify(requisitionsService.updateCamfilRequisitionStatus('4711', 'APPROVED', 'test comment')).once();
        done();
      });
    });

    it('should retrieve the requisition after updating the status', done => {
      actions$ = of(
        updateCamfilRequisitionStatus({
          requisitionId: '4711',
          status: 'APPROVED',
          approvalComment: 'test comment',
        })
      );

      effects.updateCamfilRequisitionStatus$.subscribe(action => {
        expect(action).toMatchInlineSnapshot(`
          [Camfil Requisitions API] Update Requisition Status Success:
            requisition: {"id":"testUUID","requisitionNo":"0001","user":{"firstName":...
            status: "pending"
        `);
        done();
      });
    });
  });
});
