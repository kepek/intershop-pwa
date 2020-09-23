import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Store } from '@ngrx/store';
import { cold, hot } from 'jest-marbles';
import { of, throwError } from 'rxjs';
import { anyNumber, anyString, anything, instance, mock, verify, when } from 'ts-mockito';

import { FeatureToggleModule } from 'ish-core/feature-toggle.module';
import { Customer } from 'ish-core/models/customer/customer.model';
import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { displaySuccessMessage } from 'ish-core/store/core/messages';
import { CustomerStoreModule } from 'ish-core/store/customer/customer-store.module';
import { loginUserSuccess } from 'ish-core/store/customer/user';
import { makeHttpError } from 'ish-core/utils/dev/api-service-utils';

import { CamCard } from '../../models/cam-card/cam-card.model';
import { CamCardService } from '../../services/cam-card/cam-card.service';
import { CamCardsStoreModule } from '../cam-cards-store.module';

import {
  addProductToCamCard,
  addProductToCamCardFail,
  addProductToCamCardSuccess,
  addProductToNewCamCard,
  createCamCard,
  createCamCardFail,
  createCamCardSuccess,
  deleteCamCard,
  deleteCamCardFail,
  deleteCamCardSuccess,
  loadCamCards,
  loadCamCardsFail,
  loadCamCardsSuccess,
  moveItemToCamCard,
  removeItemFromCamCard,
  removeItemFromCamCardFail,
  removeItemFromCamCardSuccess,
  selectCamCard,
  updateCamCard,
  updateCamCardFail,
  updateCamCardSuccess,
} from './cam-card.actions';
import { CamCardEffects } from './cam-card.effects';

describe('Cam Card Effects', () => {
  let actions$;
  let camCardServiceMock: CamCardService;
  let effects: CamCardEffects;
  let store$: Store;
  let router: Router;

  const customer = { customerNo: 'CID', isBusinessCustomer: true } as Customer;

  const camCards = [
    {
      title: 'testing cam cards',
      id: '.SKsEQAE4FIAAAFuNiUBWx0d',
      itemsCount: 0,
      public: false,
    },
    {
      title: 'testing cam cards 2',
      id: '.AsdHS18FIAAAFuNiUBWx0d',
      itemsCount: 0,
      public: false,
    },
  ];
  @Component({ template: 'dummy' })
  class DummyComponent {}

  beforeEach(() => {
    camCardServiceMock = mock(CamCardService);

    TestBed.configureTestingModule({
      declarations: [DummyComponent],
      imports: [
        CamCardsStoreModule.forTesting('camCards'),
        CoreStoreModule.forTesting(['router']),
        CustomerStoreModule.forTesting('user'),
        FeatureToggleModule.forTesting('camCards'),
        RouterTestingModule.withRoutes([{ path: 'account/cam-cards/:camCardName', component: DummyComponent }]),
      ],
      providers: [
        CamCardEffects,
        provideMockActions(() => actions$),
        { provide: CamCardService, useFactory: () => instance(camCardServiceMock) },
      ],
    });

    effects = TestBed.inject(CamCardEffects);
    store$ = TestBed.inject(Store);
    router = TestBed.inject(Router);
  });

  describe('loadCamCard$', () => {
    beforeEach(() => {
      store$.dispatch(loginUserSuccess({ customer }));
      when(camCardServiceMock.getCamCards()).thenReturn(of(camCards));
    });

    it('should call the CamCardService for loadCamCard', done => {
      const action = loadCamCards();
      actions$ = of(action);

      effects.loadCamCards$.subscribe(() => {
        verify(camCardServiceMock.getCamCards()).once();
        done();
      });
    });

    it('should map to actions of type LoadCamCardsSuccess', () => {
      const action = loadCamCards();
      const completion = loadCamCardsSuccess({
        camCards,
      });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadCamCards$).toBeObservable(expected$);
    });

    it('should map failed calls to actions of type LoadCamCardFail', () => {
      const error = makeHttpError({ message: 'invalid' });
      when(camCardServiceMock.getCamCards()).thenReturn(throwError(error));
      const action = loadCamCards();
      const completion = loadCamCardsFail({
        error,
      });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.loadCamCards$).toBeObservable(expected$);
    });
  });

  describe('createCamCard$', () => {
    const camCardData = [
      {
        title: 'testing cam cards',
        id: '.SKsEQAE4FIAAAFuNiUBWx0d',
      } as CamCard,
    ];
    const createCamCardData = {
      title: 'testing cam cards',
      public: false,
    };
    beforeEach(() => {
      store$.dispatch(loginUserSuccess({ customer }));
      when(camCardServiceMock.createCamCard(anything())).thenReturn(of(camCardData[0]));
    });

    it('should call the CamCardService for createCamCard', done => {
      const action = createCamCard({ camCards: createCamCardData });
      actions$ = of(action);

      effects.createCamCard$.subscribe(() => {
        verify(camCardServiceMock.createCamCard(anything())).once();
        done();
      });
    });

    it('should map to actions of type CreateCamCardSuccess and SuccessMessage', () => {
      const action = createCamCard({ camCards: createCamCardData });
      const completion1 = createCamCardSuccess({
        camCard: camCardData[0],
      });
      const completion2 = displaySuccessMessage({
        message: 'camfil.account.cam_card.new_cam_card.confirmation',
        messageParams: { 0: createCamCardData.title },
      });
      actions$ = hot('-a----a----a', { a: action });
      const expected$ = cold('-(cd)-(cd)-(cd)', { c: completion1, d: completion2 });

      expect(effects.createCamCard$).toBeObservable(expected$);
    });
    it('should map failed calls to actions of type CreateCamCardFail', () => {
      const error = makeHttpError({ message: 'invalid' });
      when(camCardServiceMock.createCamCard(anything())).thenReturn(throwError(error));
      const action = createCamCard({ camCards: createCamCardData });
      const completion = createCamCardFail({
        error,
      });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.createCamCard$).toBeObservable(expected$);
    });
  });

  describe('deleteCamCard$', () => {
    const id = camCards[0].id;
    beforeEach(() => {
      store$.dispatch(loginUserSuccess({ customer }));
      store$.dispatch(createCamCardSuccess({ camCard: camCards[0] }));
      when(camCardServiceMock.deleteCamCard(anyString())).thenReturn(of(undefined));
    });

    it('should call the CamCardService for deleteCamCard', done => {
      const action = deleteCamCard({ camCardId: id });
      actions$ = of(action);

      effects.deleteCamCard$.subscribe(() => {
        verify(camCardServiceMock.deleteCamCard(id)).once();
        done();
      });
    });

    it('should map to actions of type DeleteCamCardSuccess', () => {
      const action = deleteCamCard({ camCardId: id });
      const completion1 = deleteCamCardSuccess({ camCardId: id });
      const completion2 = displaySuccessMessage({
        message: 'camfil.account.cam_card.delete_cam_card.confirmation',
        messageParams: { 0: camCards[0].title },
      });
      actions$ = hot('-a----a----a', { a: action });
      const expected$ = cold('-(cd)-(cd)-(cd)', { c: completion1, d: completion2 });

      expect(effects.deleteCamCard$).toBeObservable(expected$);
    });
    it('should map failed calls to actions of type DeleteCamCardFail', () => {
      const error = makeHttpError({ message: 'invalid' });
      when(camCardServiceMock.deleteCamCard(anyString())).thenReturn(throwError(error));
      const action = deleteCamCard({ camCardId: id });
      const completion = deleteCamCardFail({
        error,
      });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.deleteCamCard$).toBeObservable(expected$);
    });
  });

  describe('updateCamCard$', () => {
    const camCardDetailData = [
      {
        title: 'testing cam cards',
        id: '.SKsEQAE4FIAAAFuNiUBWx0d',
        itemCount: 0,
        public: false,
      },
    ];
    beforeEach(() => {
      store$.dispatch(loginUserSuccess({ customer }));
      when(camCardServiceMock.updateCamCard(anything())).thenReturn(of(camCardDetailData[0]));
    });

    it('should call the CamCardService for updateCamCard', done => {
      const action = updateCamCard({ camCard: camCardDetailData[0] });
      actions$ = of(action);

      effects.updateCamCard$.subscribe(() => {
        verify(camCardServiceMock.updateCamCard(anything())).once();
        done();
      });
    });

    it('should map to actions of type UpdateCamCardSuccess', () => {
      const action = updateCamCard({ camCard: camCardDetailData[0] });
      const completion1 = updateCamCardSuccess({ camCard: camCardDetailData[0] });
      const completion2 = displaySuccessMessage({
        message: 'camfil.account.cam_cards.edit.confirmation',
        messageParams: { 0: camCardDetailData[0].title },
      });
      actions$ = hot('-a----a----a', { a: action });
      const expected$ = cold('-(cd)-(cd)-(cd)', { c: completion1, d: completion2 });

      expect(effects.updateCamCard$).toBeObservable(expected$);
    });
    it('should map failed calls to actions of type UpdateCamCardFail', () => {
      const error = makeHttpError({ message: 'invalid' });
      when(camCardServiceMock.updateCamCard(anything())).thenReturn(throwError(error));
      const action = updateCamCard({ camCard: camCardDetailData[0] });
      const completion = updateCamCardFail({
        error,
      });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.updateCamCard$).toBeObservable(expected$);
    });
  });
  describe('addProductToCamCard$', () => {
    const payload = {
      camCardId: '.SKsEQAE4FIAAAFuNiUBWx0d',
      sku: 'sku',
      quantity: 2,
    };

    beforeEach(() => {
      store$.dispatch(loginUserSuccess({ customer }));
      when(camCardServiceMock.addProductToCamCard(anyString(), anyString(), anyNumber())).thenReturn(of(camCards[0]));
    });

    it('should call the CamCardService for addProductToCamCard', done => {
      const action = addProductToCamCard(payload);
      actions$ = of(action);

      effects.addProductToCamCard$.subscribe(() => {
        verify(camCardServiceMock.addProductToCamCard(payload.camCardId, payload.sku, payload.quantity)).once();
        done();
      });
    });

    it('should map to actions of type AddProductToCamCardSuccess', () => {
      const action = addProductToCamCard(payload);
      const completion = addProductToCamCardSuccess({ camCard: camCards[0] });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });
      expect(effects.addProductToCamCard$).toBeObservable(expected$);
    });

    it('should map failed calls to actions of type AddProductToCamCardFail', () => {
      const error = makeHttpError({ message: 'invalid' });
      when(camCardServiceMock.addProductToCamCard(anyString(), anyString(), anything())).thenReturn(throwError(error));
      const action = addProductToCamCard(payload);
      const completion = addProductToCamCardFail({
        error,
      });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.addProductToCamCard$).toBeObservable(expected$);
    });
  });

  describe('addProductToNewCamCard$', () => {
    const payload = {
      title: 'new Cam Card',
      sku: 'sku',
    };
    const camCard = {
      title: 'testing cam cards',
      id: '.SKsEQAE4FIAAAFuNiUBWx0d',
      itemCount: 0,
      public: false,
    };
    beforeEach(() => {
      store$.dispatch(loginUserSuccess({ customer }));
      when(camCardServiceMock.createCamCard(anything())).thenReturn(of(camCard));
    });
    it('should map to actions of types CreateCamCardSuccess and AddProductToCamCard', () => {
      const action = addProductToNewCamCard(payload);
      const completion1 = createCamCardSuccess({ camCard });
      const completion2 = addProductToCamCard({ camCardId: camCard.id, sku: payload.sku });
      const completion3 = selectCamCard({ id: camCard.id });
      actions$ = hot('-a-----a-----a', { a: action });
      const expected$ = cold('-(bcd)-(bcd)-(bcd)', { b: completion1, c: completion2, d: completion3 });
      expect(effects.addProductToNewCamCard$).toBeObservable(expected$);
    });
    it('should map failed calls to actions of type CreateCamCardFail', () => {
      const error = makeHttpError({ message: 'invalid' });
      when(camCardServiceMock.createCamCard(anything())).thenReturn(throwError(error));
      const action = addProductToNewCamCard(payload);
      const completion = createCamCardFail({
        error,
      });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.addProductToNewCamCard$).toBeObservable(expected$);
    });
  });

  describe('moveProductToCamCard$', () => {
    const payload1 = {
      source: { id: '1234' },
      target: { title: 'new Cam Card', sku: 'sku', quantity: 1 },
    };
    const payload2 = {
      source: { id: '1234' },
      target: { id: '.SKsEQAE4FIAAAFuNiUBWx0d', sku: 'sku', quantity: 1 },
    };
    const camCard = {
      title: 'testing cam cards',
      id: '.SKsEQAE4FIAAAFuNiUBWx0d',
      itemCount: 0,
      public: false,
    };
    beforeEach(() => {
      store$.dispatch(loginUserSuccess({ customer }));
      when(camCardServiceMock.createCamCard(anything())).thenReturn(of(camCard));
    });
    it('should map to actions of types AddProductToNewCamCard and RemoveItemFromCamCard if there is no target id given', () => {
      const action = moveItemToCamCard(payload1);
      const completion1 = addProductToNewCamCard({
        title: payload1.target.title,
        sku: payload1.target.sku,
        quantity: payload1.target.quantity,
      });
      const completion2 = removeItemFromCamCard({
        camCardId: payload1.source.id,
        sku: payload1.target.sku,
      });
      actions$ = hot('-a----a----a', { a: action });
      const expected$ = cold('-(bc)-(bc)-(bc)', { b: completion1, c: completion2 });
      expect(effects.moveItemToCamCard$).toBeObservable(expected$);
    });
    it('should map to actions of types AddProductToCamCard and RemoveItemFromCamCard if there is a target id given', () => {
      const action = moveItemToCamCard(payload2);
      const completion1 = addProductToCamCard({
        camCardId: camCard.id,
        sku: payload1.target.sku,
        quantity: payload1.target.quantity,
      });
      const completion2 = removeItemFromCamCard({
        camCardId: payload1.source.id,
        sku: payload1.target.sku,
      });
      actions$ = hot('-a----a----a', { a: action });
      const expected$ = cold('-(bc)-(bc)-(bc)', { b: completion1, c: completion2 });
      expect(effects.moveItemToCamCard$).toBeObservable(expected$);
    });
  });

  describe('removeProductFromCamCard$', () => {
    const payload = {
      camCardId: '.SKsEQAE4FIAAAFuNiUBWx0d',
      sku: 'sku',
    };
    const camCard = {
      title: 'testing cam cards',
      id: '.SKsEQAE4FIAAAFuNiUBWx0d',
      itemCount: 0,

      public: false,
    };
    beforeEach(() => {
      store$.dispatch(loginUserSuccess({ customer }));
      when(camCardServiceMock.removeProductFromCamCard(anyString(), anyString())).thenReturn(of(camCard));
    });

    it('should call the CamCardService for removeProductFromCamCard', done => {
      const action = removeItemFromCamCard(payload);
      actions$ = of(action);

      effects.removeProductFromCamCard$.subscribe(() => {
        verify(camCardServiceMock.removeProductFromCamCard(payload.camCardId, payload.sku)).once();
        done();
      });
    });
    it('should map to actions of type RemoveItemFromCamCardSuccess', () => {
      const action = removeItemFromCamCard(payload);
      const completion = removeItemFromCamCardSuccess({ camCard });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });
      expect(effects.removeProductFromCamCard$).toBeObservable(expected$);
    });
    it('should map failed calls to actions of type RemoveItemFromCamCardFail', () => {
      const error = makeHttpError({ message: 'invalid' });
      when(camCardServiceMock.removeProductFromCamCard(anyString(), anyString())).thenReturn(throwError(error));
      const action = removeItemFromCamCard(payload);
      const completion = removeItemFromCamCardFail({
        error,
      });
      actions$ = hot('-a-a-a', { a: action });
      const expected$ = cold('-c-c-c', { c: completion });

      expect(effects.removeProductFromCamCard$).toBeObservable(expected$);
    });
  });

  describe('routeListenerForSelectedCamCard$', () => {
    it('should map to action of type SelectCamCard', done => {
      router.navigateByUrl('/account/cam-cards/.SKsEQAE4FIAAAFuNiUBWx0d');

      effects.routeListenerForSelectedCamCard$.subscribe(action => {
        expect(action).toMatchInlineSnapshot(`
          [Cam Cards Internal] Select Cam Card:
            id: ".SKsEQAE4FIAAAFuNiUBWx0d"
        `);
        done();
      });
    });
  });

  describe('loadCamCardsAfterLogin$', () => {
    beforeEach(() => {
      when(camCardServiceMock.getCamCards()).thenReturn(of(camCards));
    });
    it('should call CamCardsService after login action was dispatched', done => {
      effects.loadCamCardsAfterLogin$.subscribe(action => {
        expect(action.type).toEqual(loadCamCards.type);
        done();
      });

      store$.dispatch(loginUserSuccess({ customer }));
    });
  });

  describe('setCamCardBreadcrumb$', () => {
    beforeEach(() => {
      store$.dispatch(loadCamCardsSuccess({ camCards }));
      store$.dispatch(selectCamCard({ id: camCards[0].id }));
    });

    it('should set the breadcrumb of the selected Cam Card when on account url', done => {
      router.navigateByUrl('/account/cam-cards/' + camCards[0].id);

      effects.setCamCardBreadcrumb$.subscribe(action => {
        expect(action.payload).toMatchInlineSnapshot(`
          Object {
            "breadcrumbData": Array [
              Object {
                "key": "camfil.account.cam_cards.link",
                "link": "/account/cam-cards",
              },
              Object {
                "text": "testing cam cards",
              },
            ],
          }
        `);
        done();
      });
    });

    it('should not set the breadcrumb of the selected Cam Card when on another url', done => {
      effects.setCamCardBreadcrumb$.subscribe(fail, fail, fail);

      setTimeout(done, 1000);
    });
  });
});
