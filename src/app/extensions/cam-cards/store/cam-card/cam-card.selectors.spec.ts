import { TestBed } from '@angular/core/testing';

import { CoreStoreModule } from 'ish-core/store/core/core-store.module';
import { makeHttpError } from 'ish-core/utils/dev/api-service-utils';
import { StoreWithSnapshots, provideStoreSnapshots } from 'ish-core/utils/dev/ngrx-testing';

import { CamCardsStoreModule } from '../cam-cards-store.module';

import {
  createCamCard,
  createCamCardFail,
  createCamCardSuccess,
  deleteCamCard,
  deleteCamCardFail,
  deleteCamCardSuccess,
  loadCamCards,
  loadCamCardsFail,
  loadCamCardsSuccess,
  selectCamCard,
  updateCamCard,
  updateCamCardFail,
  updateCamCardSuccess,
} from './cam-card.actions';
import {
  getAllCamCards,
  getCamCardDetails,
  getCamCardError,
  getCamCardLoading,
  getSelectedCamCardDetails,
  getSelectedCamCardId,
} from './cam-card.selectors';

describe('Cam Card Selectors', () => {
  let store$: StoreWithSnapshots;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [CamCardsStoreModule.forTesting('camCards'), CoreStoreModule.forTesting()],
      providers: [provideStoreSnapshots()],
    });

    store$ = TestBed.inject(StoreWithSnapshots);
  });

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

  describe('initial state', () => {
    it('should not be loading when in initial state', () => {
      expect(getCamCardLoading(store$.state)).toBeFalse();
    });
    it('should not have a selected cam cards when in initial state', () => {
      expect(getSelectedCamCardId(store$.state)).toBeUndefined();
    });
    it('should not have an error when in initial state', () => {
      expect(getCamCardError(store$.state)).toBeUndefined();
    });
  });

  describe('loading cam cards', () => {
    describe('LoadCamCards', () => {
      const loadCamCardAction = loadCamCards();

      beforeEach(() => {
        store$.dispatch(loadCamCardAction);
      });

      it('should set loading to true', () => {
        expect(getCamCardLoading(store$.state)).toBeTrue();
      });
    });

    describe('LoadCamCardsSuccess', () => {
      const loadCamCardSuccessAction = loadCamCardsSuccess({ camCards });

      beforeEach(() => {
        store$.dispatch(loadCamCardSuccessAction);
      });

      it('should set loading to false', () => {
        expect(getCamCardLoading(store$.state)).toBeFalse();
      });

      it('should add cam cards to state', () => {
        expect(getAllCamCards(store$.state)).toEqual(camCards);
      });
    });

    describe('LoadCamCardsFail', () => {
      const loadCamCardsFailAction = loadCamCardsFail({ error: makeHttpError({ message: 'invalid' }) });

      beforeEach(() => {
        store$.dispatch(loadCamCardsFailAction);
      });

      it('should set loading to false', () => {
        expect(getCamCardLoading(store$.state)).toBeFalse();
      });

      it('should add the error to state', () => {
        expect(getCamCardError(store$.state)).toMatchInlineSnapshot(`
          Object {
            "message": "invalid",
            "name": "HttpErrorResponse",
          }
        `);
      });
    });
  });

  describe('create a cam cards', () => {
    describe('CreateCamCard', () => {
      const createCamCardAction = createCamCard({
        camCards: {
          title: 'create title',
        },
      });

      beforeEach(() => {
        store$.dispatch(createCamCardAction);
      });

      it('should set loading to true', () => {
        expect(getCamCardLoading(store$.state)).toBeTrue();
      });
    });

    describe('CreateCamCardSuccess', () => {
      const createCamCardSuccessAction = createCamCardSuccess({ camCard: camCards[0] });

      beforeEach(() => {
        store$.dispatch(createCamCardSuccessAction);
      });

      it('should set loading to false', () => {
        expect(getCamCardLoading(store$.state)).toBeFalse();
      });

      it('should add new cam cards to state', () => {
        expect(getAllCamCards(store$.state)).toContainEqual(camCards[0]);
      });
    });

    describe('CreateCamCardtFail', () => {
      const createCamCardFailAction = createCamCardFail({ error: makeHttpError({ message: 'invalid' }) });

      beforeEach(() => {
        store$.dispatch(createCamCardFailAction);
      });

      it('should set loading to false', () => {
        expect(getCamCardLoading(store$.state)).toBeFalse();
      });

      it('should add the error to state', () => {
        expect(getCamCardError(store$.state)).toMatchInlineSnapshot(`
          Object {
            "message": "invalid",
            "name": "HttpErrorResponse",
          }
        `);
      });
    });
  });

  describe('delete a cam cards', () => {
    describe('DeleteCamCard', () => {
      const deleteCamCardAction = deleteCamCard({ camCardId: 'id' });

      beforeEach(() => {
        store$.dispatch(deleteCamCardAction);
      });

      it('should set loading to true', () => {
        expect(getCamCardLoading(store$.state)).toBeTrue();
      });
    });

    describe('DeleteCamCardSuccess', () => {
      const loadCamCardSuccessAction = loadCamCardsSuccess({ camCards });
      const deleteCamCardSuccessAction = deleteCamCardSuccess({
        camCardId: camCards[0].id,
      });

      it('should set loading to false', () => {
        store$.dispatch(deleteCamCardSuccessAction);

        expect(getCamCardLoading(store$.state)).toBeFalse();
      });

      it('should remove cam cards from state, when cam cards delete action was called', () => {
        store$.dispatch(loadCamCardSuccessAction);
        store$.dispatch(deleteCamCardSuccessAction);

        expect(getAllCamCards(store$.state)).not.toContain(camCards[0]);
      });
    });

    describe('DeleteCamCardFail', () => {
      const deleteCamCardFailAction = deleteCamCardFail({ error: makeHttpError({ message: 'invalid' }) });

      beforeEach(() => {
        store$.dispatch(deleteCamCardFailAction);
      });

      it('should set loading to false', () => {
        expect(getCamCardLoading(store$.state)).toBeFalse();
      });

      it('should add the error to state', () => {
        expect(getCamCardError(store$.state)).toMatchInlineSnapshot(`
          Object {
            "message": "invalid",
            "name": "HttpErrorResponse",
          }
        `);
      });
    });
  });

  describe('updating a cam cards', () => {
    describe('UpdateCamCard', () => {
      const updateCamCardAction = updateCamCard({ camCard: camCards[0] });

      beforeEach(() => {
        store$.dispatch(updateCamCardAction);
      });

      it('should set loading to true', () => {
        expect(getCamCardLoading(store$.state)).toBeTrue();
      });
    });

    describe('UpdatCamCardSuccess', () => {
      const updated = {
        ...camCards[0],
        title: 'new title',
      };
      const updateCamCardSuccessAction = updateCamCardSuccess({
        camCard: updated,
      });
      const loadCamCardSuccess = loadCamCardsSuccess({ camCards });

      it('should set loading to false', () => {
        store$.dispatch(updateCamCardSuccessAction);

        expect(getCamCardLoading(store$.state)).toBeFalse();
      });

      it('should update cam cards title to new title', () => {
        store$.dispatch(loadCamCardSuccess);
        store$.dispatch(updateCamCardSuccessAction);

        expect(getAllCamCards(store$.state)).toContainEqual(updated);
      });
    });

    describe('UpdateCamCardFail', () => {
      const updateCamCardFailAction = updateCamCardFail({ error: makeHttpError({ message: 'invalid' }) });

      beforeEach(() => {
        store$.dispatch(updateCamCardFailAction);
      });

      it('should set loading to false', () => {
        expect(getCamCardLoading(store$.state)).toBeFalse();
      });

      it('should add the error to state', () => {
        expect(getCamCardError(store$.state)).toMatchInlineSnapshot(`
          Object {
            "message": "invalid",
            "name": "HttpErrorResponse",
          }
        `);
      });
    });
  });

  describe('Get Selected Cam Card', () => {
    const loadCamCardsSuccessActions = loadCamCardsSuccess({ camCards });
    const selectCamCardAction = selectCamCard({ id: camCards[1].id });

    beforeEach(() => {
      store$.dispatch(loadCamCardsSuccessActions);
      store$.dispatch(selectCamCardAction);
    });

    it('should return correct cam cards id for given id', () => {
      expect(getSelectedCamCardId(store$.state)).toEqual(camCards[1].id);
    });

    it('should return correct cam cards details for given id', () => {
      expect(getSelectedCamCardDetails(store$.state)).toEqual(camCards[1]);
    });
  });

  describe('Get Cam Card Details', () => {
    const loadCamCardSuccessActions = loadCamCardsSuccess({ camCards });

    beforeEach(() => {
      store$.dispatch(loadCamCardSuccessActions);
    });

    it('should return correct cam cards for given id', () => {
      expect(getCamCardDetails(store$.state, { id: camCards[1].id })).toEqual(camCards[1]);
    });
  });
});
