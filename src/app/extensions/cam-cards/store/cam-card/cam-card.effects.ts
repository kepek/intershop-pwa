import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { concat } from 'rxjs';
import { concatMap, filter, last, map, mapTo, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';

import { displaySuccessMessage } from 'ish-core/store/core/messages';
import { ofUrl, selectRouteParam } from 'ish-core/store/core/router';
import { setBreadcrumbData } from 'ish-core/store/core/viewconf';
import { getCurrentBasket } from 'ish-core/store/customer/basket';
import { getUserAuthorized } from 'ish-core/store/customer/user';
import {
  distinctCompareWith,
  mapErrorToAction,
  mapToPayload,
  mapToPayloadProperty,
  whenTruthy,
} from 'ish-core/utils/operators';

import { CamCard, CamCardHeader } from '../../models/cam-card/cam-card.model';
import { CamCardService } from '../../services/cam-card/cam-card.service';

import {
  addBasketToNewCamCard,
  addBasketToNewCamCardFail,
  addBasketToNewCamCardSuccess,
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
import { getCamCardDetails, getSelectedCamCardDetails, getSelectedCamCardId } from './cam-card.selectors';

@Injectable()
export class CamCardEffects {
  constructor(private actions$: Actions, private camCardService: CamCardService, private store: Store) {}

  loadCamCards$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadCamCards),
      withLatestFrom(this.store.pipe(select(getUserAuthorized))),
      filter(([, authorized]) => authorized),
      switchMap(() =>
        this.camCardService.getCamCards().pipe(
          map(camCards => loadCamCardsSuccess({ camCards })),
          mapErrorToAction(loadCamCardsFail)
        )
      )
    )
  );

  createCamCard$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createCamCard),
      mapToPayloadProperty('camCards'),
      mergeMap((camCardData: CamCardHeader) =>
        this.camCardService.createCamCard(camCardData).pipe(
          mergeMap(camCard => [
            createCamCardSuccess({ camCard }),
            displaySuccessMessage({
              message: 'camfil.account.cam_card.new_cam_card.confirmation',
              messageParams: { 0: camCard.title },
            }),
          ]),
          mapErrorToAction(createCamCardFail)
        )
      )
    )
  );

  addBasketToNewCamCard$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addBasketToNewCamCard),
      mapToPayload(),
      mergeMap(payload =>
        this.camCardService
          .createCamCard({
            title: payload.camCards.title,
          })
          .pipe(
            withLatestFrom(this.store.pipe(select(getCurrentBasket))),
            // use created cam cards data to dispatch addProduct action
            concatMap(([camCard, currentBasket]) =>
              concat(
                ...currentBasket.lineItems.map(lineItem =>
                  this.camCardService.addProductToCamCard(camCard.id, lineItem.productSKU, lineItem.quantity.value)
                )
              ).pipe(
                last(),
                concatMap(newCamCard => [
                  addBasketToNewCamCardSuccess({ camCard: newCamCard }),
                  displaySuccessMessage({
                    message: 'camfil.account.cam_card.new_from_basket_confirm.heading',
                    messageParams: { 0: camCard.title },
                  }),
                ]),
                mapErrorToAction(addBasketToNewCamCardFail)
              )
            )
          )
      ),
      mapErrorToAction(createCamCardFail)
    )
  );

  deleteCamCard$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteCamCard),
      mapToPayloadProperty('camCardId'),
      mergeMap(camCardId => this.store.pipe(select(getCamCardDetails, { id: camCardId }))),
      whenTruthy(),
      map(camCard => ({ camCardId: camCard.id, title: camCard.title })),
      mergeMap(({ camCardId, title }) =>
        this.camCardService.deleteCamCard(camCardId).pipe(
          mergeMap(() => [
            deleteCamCardSuccess({ camCardId }),
            displaySuccessMessage({
              message: 'camfil.account.cam_card.delete_cam_card.confirmation',
              messageParams: { 0: title },
            }),
          ]),
          mapErrorToAction(deleteCamCardFail)
        )
      )
    )
  );

  updateCamCard$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateCamCard),
      mapToPayloadProperty('camCard'),
      mergeMap((newCamCard: CamCard) =>
        this.camCardService.updateCamCard(newCamCard).pipe(
          mergeMap(camCard => [
            updateCamCardSuccess({ camCard }),
            displaySuccessMessage({
              message: 'camfil.account.cam_cards.edit.confirmation',
              messageParams: { 0: camCard.title },
            }),
          ]),
          mapErrorToAction(updateCamCardFail)
        )
      )
    )
  );

  addProductToCamCard$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addProductToCamCard),
      mapToPayload(),
      mergeMap(payload =>
        this.camCardService.addProductToCamCard(payload.camCardId, payload.sku, payload.quantity).pipe(
          map(camCard => addProductToCamCardSuccess({ camCard })),
          mapErrorToAction(addProductToCamCardFail)
        )
      )
    )
  );

  addProductToNewCamCard$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addProductToNewCamCard),
      mapToPayload(),
      mergeMap(payload =>
        this.camCardService
          .createCamCard({
            title: payload.title,
          })
          .pipe(
            // use created cam cards data to dispatch addProduct action
            mergeMap(camCard => [
              createCamCardSuccess({ camCard }),
              addProductToCamCard({
                camCardId: camCard.id,
                sku: payload.sku,
                quantity: payload.quantity,
              }),
              selectCamCard({ id: camCard.id }),
            ]),
            mapErrorToAction(createCamCardFail)
          )
      )
    )
  );

  moveItemToCamCard$ = createEffect(() =>
    this.actions$.pipe(
      ofType(moveItemToCamCard),
      mapToPayload(),
      mergeMap(payload => {
        if (!payload.target.id) {
          return [
            addProductToNewCamCard({
              title: payload.target.title,
              sku: payload.target.sku,
              quantity: payload.target.quantity,
            }),
            removeItemFromCamCard({
              camCardId: payload.source.id,
              sku: payload.target.sku,
            }),
          ];
        } else {
          return [
            addProductToCamCard({
              camCardId: payload.target.id,
              sku: payload.target.sku,
              quantity: payload.target.quantity,
            }),
            removeItemFromCamCard({
              camCardId: payload.source.id,
              sku: payload.target.sku,
            }),
          ];
        }
      })
    )
  );

  removeProductFromCamCard$ = createEffect(() =>
    this.actions$.pipe(
      ofType(removeItemFromCamCard),
      mapToPayload(),
      mergeMap(payload =>
        this.camCardService.removeProductFromCamCard(payload.camCardId, payload.sku).pipe(
          map(camCard => removeItemFromCamCardSuccess({ camCard })),
          mapErrorToAction(removeItemFromCamCardFail)
        )
      )
    )
  );

  routeListenerForSelectedCamCard$ = createEffect(() =>
    this.store.pipe(
      select(selectRouteParam('camCardName')),
      distinctCompareWith(this.store.pipe(select(getSelectedCamCardId))),
      map(id => selectCamCard({ id }))
    )
  );

  /**
   * Trigger LoadCamCards action after LoginUserSuccess.
   */
  loadCamCardsAfterLogin$ = createEffect(() =>
    this.store.pipe(select(getUserAuthorized), whenTruthy(), mapTo(loadCamCards()))
  );

  setCamCardBreadcrumb$ = createEffect(() =>
    this.store.pipe(
      ofUrl(/^\/account\/.*/),
      select(getSelectedCamCardDetails),
      whenTruthy(),
      map(camCards =>
        setBreadcrumbData({
          breadcrumbData: [
            { key: 'camfil.account.cam_cards.link', link: '/account/cam-cards' },
            { text: camCards.title },
          ],
        })
      )
    )
  );
}
