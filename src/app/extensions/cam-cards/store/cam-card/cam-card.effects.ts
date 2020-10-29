import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { concat, fromEvent } from 'rxjs';
import {
  concatMap,
  distinctUntilChanged,
  filter,
  last,
  map,
  mapTo,
  mergeMap,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs/operators';

import { getDeviceType } from 'ish-core/store/core/configuration';
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

import { CamCard } from '../../models/cam-card/cam-card.model';
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
  detectCamCardToolbar,
  loadCamCards,
  loadCamCardsFail,
  loadCamCardsSuccess,
  loadContactsByCustomer,
  loadContactsByCustomerFail,
  loadContactsByCustomerSuccess,
  loadCustomers,
  loadCustomersSuccess,
  loadCustomersdFail,
  moveItemToCamCard,
  removeItemFromCamCard,
  removeItemFromCamCardFail,
  removeItemFromCamCardSuccess,
  selectCamCard,
  setStickyCamCardToolbar,
  updateCamCard,
  updateCamCardContacts,
  updateCamCardContactsFail,
  updateCamCardContactsSuccess,
  updateCamCardFail,
  updateCamCardProduct,
  updateCamCardProductSuccess,
  updateCamCardSuccess,
} from './cam-card.actions';
import { getCamCardDetails, getSelectedCamCardDetails, getSelectedCamCardId } from './cam-card.selectors';

@Injectable()
export class CamCardEffects {
  constructor(
    private actions$: Actions,
    private camCardService: CamCardService,
    private store: Store,
    private router: Router
  ) {}

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
      mergeMap((camCardData: CamCard) =>
        this.camCardService.createCamCard(camCardData).pipe(
          tap(camCard => {
            this.navigateTo(`/account/cam-cards/${camCard.id}`);
          }),
          mergeMap(camCard => [
            createCamCardSuccess({ camCard }),
            displaySuccessMessage({
              message: 'camfil.account.cam_card.new_cam_card.confirmation',
              messageParams: { 0: camCard.name },
            }),
          ]),
          mapErrorToAction(createCamCardFail)
        )
      )
    )
  );

  loadCustomers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadCustomers),
      withLatestFrom(this.store.pipe(select(getUserAuthorized))),
      filter(([, authorized]) => authorized),
      switchMap(() =>
        this.camCardService.getCustomers().pipe(
          map(camCards => loadCustomersSuccess({ customers: camCards.elements })),
          mapErrorToAction(loadCustomersdFail)
        )
      )
    )
  );

  /**
   * Trigger LoadCamCards action after LoginUserSuccess.
   */
  loadCustomersAfterLogin$ = createEffect(() =>
    this.store.pipe(select(getUserAuthorized), whenTruthy(), mapTo(loadCustomers(true)))
  );

  addBasketToNewCamCard$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addBasketToNewCamCard),
      mapToPayload(),
      mergeMap(payload =>
        this.camCardService
          .createCamCard({
            name: payload.camCards.name,
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
                    messageParams: { 0: camCard.name },
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
      map(camCard => ({ camCardId: camCard.id, name: camCard.name })),
      mergeMap(({ camCardId, name }) =>
        this.camCardService.deleteCamCard(camCardId).pipe(
          mergeMap(() => [
            deleteCamCardSuccess({ camCardId }),
            displaySuccessMessage({
              message: 'camfil.account.cam_card.delete_cam_card.confirmation',
              messageParams: { 0: name },
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
              messageParams: { 0: camCard.name },
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
            name: payload.name,
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

  updateCamCardProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateCamCardProduct),
      mapToPayload(),
      mergeMap(payload =>
        this.camCardService.updateCamCardProduct(payload.camCardId, payload.camCardItem).pipe(
          mergeMap(camCardItem => {
            const { rootCamCard, camCardId } = payload;
            return [
              updateCamCardProductSuccess({ rootCamCard, camCardId, camCardItem }),
              displaySuccessMessage({
                message: 'camfil.account.cam_cards.update.product.confirmation',
                messageParams: { 0: camCardItem.product.name },
              }),
            ];
          }),
          mapErrorToAction(updateCamCardFail)
        )
      )
    )
  );

  loadCustomerContacts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadContactsByCustomer),
      mapToPayload(),
      mergeMap(({ customerId }) =>
        this.camCardService.getContactsByCastomerId(customerId).pipe(
          map(({ elements }) => loadContactsByCustomerSuccess({ customerId, contacts: elements })),
          mapErrorToAction(loadContactsByCustomerFail)
        )
      )
    )
  );

  updateCamCardContacts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateCamCardContacts),
      mapToPayload(),
      mergeMap(({ camCardId, camCardContacts }) =>
        this.camCardService.updateCamCardContacts(camCardId, camCardContacts).pipe(
          mergeMap(contacts => [
            updateCamCardContactsSuccess({ camCardId, contacts }),
            displaySuccessMessage({
              message: 'camfil.account.cam_cards.update.contacts.confirmation',
              messageParams: { 0: camCardId },
            }),
          ]),
          mapErrorToAction(updateCamCardContactsFail)
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
              name: payload.target.name,
              sku: payload.target.sku,
              quantity: payload.target.quantity,
            }),
            removeItemFromCamCard({
              camCardId: payload.source.id,
              camCardItemId: payload.source.camCardItemId,
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
              camCardItemId: payload.source.camCardItemId,
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
        this.camCardService.removeProductFromCamCard(payload.camCardId, payload.camCardItemId).pipe(
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
            { text: camCards.name },
          ],
        })
      )
    )
  );

  decetctCamCardToolbar$ = createEffect(() =>
    this.actions$.pipe(
      ofType(detectCamCardToolbar),
      mergeMap(() =>
        this.store.pipe(
          select(getDeviceType),
          mergeMap(device =>
            fromEvent(window, 'scroll').pipe(
              map(() => {
                const bar = document.getElementsByTagName('camfil-account-cam-card-toolbar')[0] as HTMLElement;
                if (bar) {
                  const barBounding = bar.getBoundingClientRect();
                  if (device === 'mobile') {
                    return window.innerHeight > barBounding.top + barBounding.height;
                  } else {
                    return barBounding.top < barBounding.height + bar.offsetTop;
                  }
                } else {
                  return false;
                }
              }),
              distinctUntilChanged(),
              map(sticky => setStickyCamCardToolbar({ sticky }))
            )
          )
        )
      )
    )
  );
  private navigateTo(path: string): void {
    this.router.navigate([path]);
  }
}
