import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
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
  takeWhile,
  tap,
  withLatestFrom,
} from 'rxjs/operators';

import { getDeviceType } from 'ish-core/store/core/configuration';
import { displaySuccessMessage } from 'ish-core/store/core/messages';
import { ofUrl, selectQueryParam, selectRouteParam, selectUrl } from 'ish-core/store/core/router';
import { setBreadcrumbData } from 'ish-core/store/core/viewconf';
import { getCurrentBasket } from 'ish-core/store/customer/basket';
import { getUserAuthorized, loginUserSuccess } from 'ish-core/store/customer/user';
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
  addProductToNewCamCardAndEdit,
  addProductToNewSubCamCard,
  addProductToSubCamCard,
  addToNewCamCardWithNewSubCamCard,
  cloneAndEditCamCard,
  cloneAndEditCamCards,
  cloneAndEditFail,
  copyCamCard,
  copyCamCardFail,
  createCamCard,
  createCamCardFail,
  createCamCardSuccess,
  createSubCamCard,
  createVirtualCamCard,
  createVirtualCamCardFail,
  createVirtualCamCardSuccess,
  deleteCamCard,
  deleteCamCardFail,
  deleteCamCardSuccess,
  deleteSubCamCard,
  deleteSubCamCardFail,
  deleteSubCamCardSuccess,
  detectCamCardToolbar,
  editCamCard,
  loadCamCards,
  loadCamCardsEdit,
  loadCamCardsFail,
  loadCamCardsSuccess,
  loadContactsByCustomer,
  loadContactsByCustomerFail,
  loadContactsByCustomerSuccess,
  loadCustomers,
  loadCustomersSuccess,
  loadCustomersdFail,
  loadDeliveryAddresses,
  loadDeliveryAddressesFail,
  loadDeliveryAddressesSuccess,
  moveCamCard,
  moveCamCardFail,
  moveCamCardItem,
  moveCamCardItemFail,
  moveCamCardItemSuccess,
  moveCamCardSuccess,
  moveItemToCamCard,
  removeItemFromCamCard,
  removeItemFromCamCardFail,
  removeItemFromCamCardSuccess,
  resetCamCardItemPositions,
  resetCamCardItemPositionsFail,
  resetCamCardItemPositionsSuccess,
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
  updateContactsWhileMoveCamCardFail,
  updateSubCamCard,
  updateSubCamCardFail,
  updateSubCamCardSuccess,
} from './cam-card.actions';
import { getCamCardDetails, getSelectedCamCardDetails, getSelectedCamCardId } from './cam-card.selectors';

@Injectable()
export class CamCardEffects {
  constructor(
    private actions$: Actions,
    private camCardService: CamCardService,
    private store: Store,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: string
  ) {}

  loadCamCards$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadCamCards),
      withLatestFrom(this.store.pipe(select(getUserAuthorized))),
      filter(([, authorized]) => authorized),
      switchMap(() =>
        this.camCardService.getCamCards().pipe(
          map(items => {
            // TODO: to improve - move filter to selectors like getRootCamCards
            const camCards = items.filter(item => !item.rootCamCard);
            return loadCamCardsSuccess({ camCards });
          }),
          mapErrorToAction(loadCamCardsFail)
        )
      )
    )
  );

  createVirtualCamCard$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createVirtualCamCard),
      mapToPayloadProperty('camCard'),
      mergeMap((camCardData: CamCard) =>
        this.camCardService.createCamCard(camCardData).pipe(
          mergeMap(camCard => [
            createVirtualCamCardSuccess({ camCard }),
            displaySuccessMessage({
              message: 'camfil.account.cam_card.new_cam_card.confirmation',
              messageParams: { 0: camCard.name },
            }),
          ]),
          mapErrorToAction(createVirtualCamCardFail)
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
            this.router.navigateByUrl(`/account/cam-cards/${camCard.id}`);
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

  createSubCamCard$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createSubCamCard),
      mapToPayload(),
      mergeMap(payload =>
        this.camCardService.createSubCamCard(payload.subCamCard, payload.rootCamCardId).pipe(
          mergeMap(subCamCard =>
            this.camCardService
              .getCamCard(subCamCard.rootCamCard)
              .pipe(mergeMap(camCard => [createCamCardSuccess({ camCard })]))
          ),
          mapErrorToAction(addProductToCamCardFail)
        )
      )
    )
  );

  moveCamCard$ = createEffect(() =>
    this.actions$.pipe(
      ofType(moveCamCard),
      mapToPayload(),
      mergeMap(({ camCardId, newCustomerId, newContacts }) =>
        this.camCardService.moveCamCard(camCardId, newCustomerId).pipe(
          mergeMap((camCard: CamCard) => [moveCamCardSuccess({ camCard, newContacts })]),
          mapErrorToAction(moveCamCardFail)
        )
      )
    )
  );

  cloneAndEditCamCard$ = createEffect(() =>
    this.actions$.pipe(
      ofType(cloneAndEditCamCard),
      mapToPayload(),
      mergeMap(({ camCardId, camCardName }) =>
        this.camCardService.cloneCamCard(camCardId).pipe(
          mergeMap((camCard: CamCard) => [
            updateCamCard({ camCard: { id: camCard.id, name: camCardName, transient: false } }),
          ]),
          mapErrorToAction(cloneAndEditFail)
        )
      )
    )
  );

  cloneAndEditCamCards$ = createEffect(() =>
    this.actions$.pipe(
      ofType(cloneAndEditCamCards),
      mapToPayload(),
      concatMap(payload => [
        ...payload.camCards.map(camCard => cloneAndEditCamCard({ camCardId: camCard.id, camCardName: camCard.name })),
      ])
    )
  );

  moveCamCardSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(moveCamCardSuccess),
      mapToPayload(),
      mergeMap(({ camCard, newContacts }) =>
        this.camCardService.updateCamCardContacts(camCard.id, newContacts).pipe(
          mergeMap(() => [
            updateCamCardContactsSuccess({ camCardId: camCard.id, contacts: newContacts }),
            displaySuccessMessage({
              message: 'camfil.account.cam_card.move.confirmation',
              messageParams: { 0: camCard.id },
            }),
          ]),
          mapErrorToAction(updateContactsWhileMoveCamCardFail)
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
          map(customers => loadCustomersSuccess({ customers })),
          mapErrorToAction(loadCustomersdFail)
        )
      )
    )
  );

  loadDeliveryAddresses$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadDeliveryAddresses),
      mergeMap(payload =>
        this.camCardService.getDeliveryAddresses(payload.payload.id).pipe(
          map(addresses => loadDeliveryAddressesSuccess({ addresses })),
          mapErrorToAction(loadDeliveryAddressesFail)
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

  copyCamCard$ = createEffect(() =>
    this.actions$.pipe(
      ofType(copyCamCard),
      mapToPayload(),
      mergeMap(({ camCardId, name }) =>
        this.camCardService.copyCamCard(camCardId, name).pipe(
          tap(camCard => this.router.navigate([`/account/cam-cards/${camCard.id}`], { queryParams: { copy: true } })),
          mergeMap(camCard => [
            createCamCardSuccess({ camCard }),
            displaySuccessMessage({
              message: 'camfil.account.cam_card.delete_cam_card.confirmation',
              messageParams: { 0: camCard.name },
            }),
          ]),
          mapErrorToAction(copyCamCardFail)
        )
      )
    )
  );

  deleteSubCamCard$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteSubCamCard),
      mapToPayload(),
      mergeMap(({ rootId, id }) =>
        this.camCardService.deleteSubCamCard(rootId, id).pipe(
          mergeMap(camCard => [
            deleteSubCamCardSuccess({ camCard }),
            displaySuccessMessage({
              message: 'camfil.account.cam_card.delete_sub_cam_card.confirmation',
              messageParams: { 0: name },
            }),
          ]),
          mapErrorToAction(deleteSubCamCardFail)
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

  // prettier-ignore

  updateSubCamCard$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateSubCamCard),
      mapToPayloadProperty('sub'),
      mergeMap(sub =>
        this.camCardService.updateSubCamCard(sub).pipe(
          mergeMap(camCard => [
            updateSubCamCardSuccess({ camCard }),
            displaySuccessMessage({
              message: 'camfil.account.cam_cards.edit.confirmation',
              messageParams: { 0: camCard.name },
            }),
          ]),
          mapErrorToAction(updateSubCamCardFail)
        ))
    )
  );

  addProductToSubCamCard$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addProductToSubCamCard),
      mapToPayload(),
      mergeMap(payload =>
        this.camCardService
          .addProductToSubCamCard(
            payload.camCardId,
            payload.refreshCamCardId,
            payload.sku,
            payload.quantity,
            payload.boxLabel
          )
          .pipe(
            mergeMap(camCard => [
              addProductToCamCardSuccess({ camCard }),
              selectCamCard({ id: payload.refreshCamCardId }),
            ]),
            mapErrorToAction(addProductToCamCardFail)
          )
      )
    )
  );

  addProductToCamCard$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addProductToCamCard),
      mapToPayload(),
      mergeMap(payload =>
        this.camCardService
          .addProductToCamCard(payload.camCardId, payload.sku, payload.quantity, payload.comment, payload.position)
          .pipe(
            mergeMap(camCard =>
              payload.showSuccessToast
                ? [
                    addProductToCamCardSuccess({ camCard }),
                    displaySuccessMessage({
                      message: 'camfil.modal.addNewProduct.confirmation',
                      messageParams: { 0: payload.sku },
                    }),
                    selectCamCard({ id: camCard.id }),
                  ]
                : [addProductToCamCardSuccess({ camCard }), selectCamCard({ id: camCard.id })]
            ),
            mapErrorToAction(addProductToCamCardFail)
          )
      )
    )
  );

  addToNewCamCardWithNewSubCamCard$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addToNewCamCardWithNewSubCamCard),
      mapToPayload(),
      mergeMap(payload =>
        this.camCardService.createCamCard(payload.newCamCard).pipe(
          map(camCard =>
            addProductToNewSubCamCard({
              subCamCard: payload.newSubCamCard,
              rootCamCard: camCard,
              sku: payload.sku,
              quantity: payload.quantity,
              boxLabel: payload.boxLabel,
              edit: payload.edit,
            })
          ),
          mapErrorToAction(addProductToCamCardFail)
        )
      )
    )
  );

  addProductToNewCamCardAndEdit$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addProductToNewCamCardAndEdit),
      mapToPayload(),
      mergeMap(payload =>
        this.camCardService.createCamCard(payload.camCard).pipe(
          mergeMap(camCard => {
            const addProductPayload = {
              camCardId: camCard.id,
              sku: payload.sku,
              quantity: payload.quantity,
              boxLabel: payload.boxLabel,
            };

            return payload.edit
              ? [
                  addProductToCamCard(addProductPayload),
                  createCamCardSuccess({ camCard }),
                  selectCamCard({ id: camCard.id }),
                  editCamCard({ camCardId: camCard.id }),
                ]
              : [
                  addProductToCamCard(addProductPayload),
                  createCamCardSuccess({ camCard }),
                  selectCamCard({ id: camCard.id }),
                ];
          }),
          mapErrorToAction(addProductToCamCardFail)
        )
      )
    )
  );

  addProductToNewSubCamCard$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addProductToNewSubCamCard),
      mapToPayload(),
      mergeMap(payload =>
        this.camCardService.createSubCamCard(payload.subCamCard, payload.rootCamCard.id).pipe(
          mergeMap(camCard => {
            const addProductPayload = {
              camCardId: camCard.id,
              refreshCamCardId: payload.rootCamCard.id,
              sku: payload.sku,
              quantity: payload.quantity,
              boxLabel: payload.boxLabel,
            };

            return payload.edit
              ? [addProductToSubCamCard(addProductPayload), editCamCard({ camCardId: payload.rootCamCard.id })]
              : [addProductToSubCamCard(addProductPayload)];
          }),
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

  navigateToEdit$ = createEffect(() =>
    this.actions$.pipe(
      ofType(editCamCard),
      mapToPayloadProperty('camCardId'),
      tap(camCardId => {
        this.router.navigateByUrl(`/account/cam-cards/${camCardId}`);
      }),
      mapTo(loadCamCardsEdit())
    )
  );

  loadCustomerContacts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadContactsByCustomer),
      mapToPayload(),
      mergeMap(({ customerId }) =>
        this.camCardService.getContactsByCustomerId(customerId).pipe(
          map(contacts => loadContactsByCustomerSuccess({ customerId, contacts })),
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
          mergeMap(() => [
            updateCamCardContactsSuccess({ camCardId, contacts: camCardContacts }),
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

  moveCamCardItem$ = createEffect(() =>
    this.actions$.pipe(
      ofType(moveCamCardItem),
      mapToPayload(),
      mergeMap(payload =>
        this.camCardService
          .addProductToCamCard(
            payload.target.id,
            payload.source.camCardItem.product.sku,
            payload.source.camCardItem.quantity,
            payload.source.camCardItem.comment,
            payload.target.position
          )
          .pipe(
            mergeMap(targetCamCard =>
              this.camCardService.removeProductFromCamCard(payload.source.id, payload.source.camCardItem.id).pipe(
                map(sourceCamCard => moveCamCardItemSuccess({ sourceCamCard, targetCamCard })),
                mapErrorToAction(moveCamCardItemFail)
              )
            )
          )
      )
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

  resetItemPositions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(resetCamCardItemPositions),
      mapToPayload(),
      mergeMap(payload =>
        this.camCardService.resetItemPositions(payload.camCard.rootCamCard, payload.camCard.id).pipe(
          map(camCardItems =>
            resetCamCardItemPositionsSuccess({
              camCard: payload.camCard,
              camCardItems,
            })
          ),
          mapErrorToAction(resetCamCardItemPositionsFail)
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

  redirectAfterLogin$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(loginUserSuccess),
        takeWhile(() => isPlatformBrowser(this.platformId)),
        whenTruthy(),
        withLatestFrom(this.store.pipe(select(selectUrl)), this.store.pipe(select(selectQueryParam('returnUrl')))),
        tap(([, url, returnUrl]) => {
          if (url.startsWith('/login')) {
            if (returnUrl) {
              this.router.navigateByUrl(returnUrl);
            } else {
              this.router.navigateByUrl('account/cam-cards');
            }
          }
        })
      ),
    { dispatch: false }
  );
}
