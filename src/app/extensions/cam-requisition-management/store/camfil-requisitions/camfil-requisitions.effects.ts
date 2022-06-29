import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { combineLatest, of } from 'rxjs';
import { concatMap, filter, map, mergeMap, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { getCamCardCustomers, loadCustomers } from 'src/app/extensions/cam-cards/store/cam-card';

import { ProductCompletenessLevel } from 'ish-core/models/product/product.model';
import { displayErrorMessage, displaySuccessMessage } from 'ish-core/store/core/messages';
import { ofUrl, selectRouteParam } from 'ish-core/store/core/router';
import { getCurrentBasketId, submitBasketSuccess } from 'ish-core/store/customer/basket';
import { getProduct, loadProductIfNotLoaded } from 'ish-core/store/shopping/products';
import { mapErrorToAction, mapToPayload, mapToPayloadProperty, whenTruthy } from 'ish-core/utils/operators';

import {
  CamfilRequisitionStatusCodes,
  CamfilRequisitionStatuses,
} from '../../models/camfil-requisition/camfil-requisition.interface';
import { CamfilRequisition } from '../../models/camfil-requisition/camfil-requisition.model';
import { CamfilRequisitionsService } from '../../services/requisitions/camfil-requisitions.service';

import {
  addCamfilRequisitionLineItemAttribute,
  addCamfilRequisitionLineItemAttributeFail,
  addCamfilRequisitionLineItemAttributeSuccess,
  addProductToCamfilRequisition,
  addProductToCamfilRequisitionFail,
  addProductToCamfilRequisitionSuccess,
  approveCamfilRequisitionLineItems,
  approveCamfilRequisitionLineItemsFail,
  checkProductAvailabilityFail,
  createCamfilRequisition,
  createCamfilRequisitionFail,
  createCamfilRequisitionSuccess,
  createOrderFromApprovedRequisition,
  createOrderFromApprovedRequisitionFail,
  createOrderFromApprovedRequisitionLineItems,
  createOrderFromApprovedRequisitionLineItemsSuccess,
  createOrderFromApprovedRequisitionSuccess,
  deleteCamfilRequisitionLineItemAttribute,
  deleteCamfilRequisitionLineItemAttributeFail,
  deleteCamfilRequisitionLineItemAttributeSuccess,
  getCamfilRequisitionData,
  loadCamfilRequisition,
  loadCamfilRequisitionFail,
  loadCamfilRequisitions,
  loadCamfilRequisitionsFail,
  loadCamfilRequisitionsSuccess,
  loadCamfilRequisitionsuccess,
  removeLastProductFromCamfilRequisition,
  removeLastProductFromCamfilRequisitionFail,
  removeLastProductFromCamfilRequisitionSuccess,
  removeProductFromCamfilRequisition,
  removeProductFromCamfilRequisitionFail,
  removeProductFromCamfilRequisitionSuccess,
  updateCamfilRequisition,
  updateCamfilRequisitionAddress,
  updateCamfilRequisitionAddressSuccess,
  updateCamfilRequisitionFail,
  updateCamfilRequisitionLineItem,
  updateCamfilRequisitionLineItemAttribute,
  updateCamfilRequisitionLineItemAttributeFail,
  updateCamfilRequisitionLineItemAttributeSuccess,
  updateCamfilRequisitionLineItemFail,
  updateCamfilRequisitionLineItemSuccess,
  updateCamfilRequisitionStatus,
  updateCamfilRequisitionStatusFail,
  updateCamfilRequisitionStatusSuccess,
  updateCamfilRequisitionSuccess,
  updateMultipleCamfilRequisitionStatus,
  updateMultipleCamfileRequisitionStatusFail,
} from './camfil-requisitions.actions';
import { getSelectedCamfilRequisitionId } from './camfil-requisitions.selectors';

@Injectable()
export class CamfilRequisitionsEffects {
  constructor(
    private actions$: Actions,
    private requisitionsService: CamfilRequisitionsService,
    private router: Router,
    private store: Store
  ) {}

  loadCamfilRequisitions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadCamfilRequisitions),
      mapToPayload(),
      concatMap(({ view }) =>
        this.requisitionsService.getCamfilRequisitions(view).pipe(
          map(requisitions => loadCamfilRequisitionsSuccess({ requisitions, view })),
          mapErrorToAction(loadCamfilRequisitionsFail)
        )
      )
    )
  );

  getCamfilRequisitionData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getCamfilRequisitionData),
      mapToPayload(),
      mergeMap(({ requisitionId }) =>
        this.requisitionsService.getCamfilRequisition(requisitionId).pipe(
          map(requisition => loadCamfilRequisitionsuccess({ requisition })),
          mapErrorToAction(loadCamfilRequisitionFail)
        )
      )
    )
  );

  loadCamfilRequisition$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadCamfilRequisition),
      mapToPayload(),
      withLatestFrom(this.store.pipe(select(getCamCardCustomers))),
      mergeMap(([requisitionId, customers]) => {
        const actions = [getCamfilRequisitionData(requisitionId)] as any[];

        if (!customers.length) {
          actions.push(loadCustomers());
        }
        return actions;
      })
    )
  );

  routeListenerForSelectingCamfilRequisition$ = createEffect(() =>
    this.store.pipe(
      ofUrl(/^\/(account\/requisitions\/approver.*|account\/requisitions\/buyer.*)/),
      select(selectRouteParam('orderId')),
      withLatestFrom(this.store.pipe(select(getSelectedCamfilRequisitionId))),
      filter(([fromAction, selectedOrderId]) => fromAction && fromAction !== selectedOrderId),
      map(([orderId]) => orderId),
      map(requisitionId => getCamfilRequisitionData({ requisitionId }))
    )
  );

  /**
   * After selecting and successfully loading a requisition, triggers a LoadProduct action
   * for each product that is missing in the current product entities state.
   */
  loadProductsForSelectedRequisition$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadCamfilRequisitionsuccess),
      mapToPayloadProperty('requisition'),
      switchMap(requisition => [
        ...requisition.lineItems.map(({ productSKU }) =>
          loadProductIfNotLoaded({ sku: productSKU, level: ProductCompletenessLevel.List })
        ),
      ])
    )
  );

  loadRequisitionAfterRequisitionItemsChangeSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateCamfilRequisitionLineItemSuccess),
      mapToPayload(),
      map(payload => loadCamfilRequisition({ requisitionId: payload.requisitionId }))
    )
  );

  updateCamfilRequisitionStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateCamfilRequisitionStatus),
      mapToPayload(),
      concatMap(payload =>
        this.requisitionsService
          .updateCamfilRequisitionStatus(payload.requisitionId, payload.status, payload.approvalComment)
          .pipe(
            map(requisition =>
              requisition.approval.statusCode === CamfilRequisitionStatusCodes.Approved
                ? createOrderFromApprovedRequisition({
                    requisitionId: requisition.id,
                  })
                : updateCamfilRequisitionStatusSuccess({
                    requisition,
                    status: requisition.approval.status,
                  })
            ),
            mapErrorToAction(updateCamfilRequisitionStatusFail)
          )
      )
    )
  );

  createOrderFromApprovedRequisition$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createOrderFromApprovedRequisition),
      mapToPayload(),
      concatMap(payload =>
        this.requisitionsService.createOrderFromApprovedRequisition(payload.requisitionId).pipe(
          map(requisition => createOrderFromApprovedRequisitionSuccess({ requisition })),
          mapErrorToAction(createOrderFromApprovedRequisitionFail)
        )
      )
    )
  );

  createOrderFromApprovedRequisitionSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createOrderFromApprovedRequisitionSuccess),
      mapToPayload(),
      map(payload =>
        updateCamfilRequisitionStatusSuccess({
          requisition: payload.requisition,
          status: payload.requisition.approval.status,
        })
      )
    )
  );

  createOrderFromApprovedRequisitionFail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createOrderFromApprovedRequisitionFail),
      mapToPayloadProperty('error'),
      whenTruthy(),
      map(error =>
        displayErrorMessage({
          message: error?.message || error?.code,
        })
      )
    )
  );

  updateCamfilRequisitionStatusSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateCamfilRequisitionStatusSuccess),
      mapToPayload(),
      mergeMap(payload => [
        displaySuccessMessage({
          message:
            payload.status === CamfilRequisitionStatuses.Approved ||
            payload.status === CamfilRequisitionStatuses.Completed
              ? 'camfil.account.approvals.status_update.approved'
              : 'camfil.account.approvals.status_update.reject',
        }),
      ])
    )
  );

  addProductToCamfilRequisition$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addProductToCamfilRequisition),
      mapToPayload(),
      mergeMap(payload => combineLatest([of(payload), this.store.pipe(select(getProduct, { sku: payload.item.sku }))])),
      concatMap(([payload, product]) => {
        if (product.availability) {
          return this.requisitionsService.addProductToCamfilRequisition(payload.requisitionId, payload.item).pipe(
            map(requisitionId => addProductToCamfilRequisitionSuccess({ requisitionId })),
            mapErrorToAction(addProductToCamfilRequisitionFail)
          );
        } else {
          return of(checkProductAvailabilityFail());
        }
      })
    )
  );

  checkProductAvailabilityFail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(checkProductAvailabilityFail),
      mergeMap(() => [
        displayErrorMessage({
          message: 'camfil.account.approvals.product_validation_fail.text',
        }),
      ])
    )
  );

  addProductsFromRequisitionSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addProductToCamfilRequisitionSuccess),
      map(() =>
        displaySuccessMessage({
          message: 'camfil.account.approvals.product_added.text',
        })
      )
    )
  );

  loadCamfilRequisitionAfterRequisitonItemsChangedSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addProductToCamfilRequisitionSuccess, removeProductFromCamfilRequisitionSuccess),
      mapToPayload(),
      map(loadCamfilRequisition)
    )
  );

  updateCamfilRequisition$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateCamfilRequisition),
      mapToPayload(),
      mergeMap(({ requisition, address }) =>
        this.requisitionsService.updateCamfilRequisition(requisition).pipe(
          map(() =>
            address
              ? updateCamfilRequisitionAddress({ requisition, address })
              : updateCamfilRequisitionSuccess({ requisition })
          ),
          mapErrorToAction(updateCamfilRequisitionFail)
        )
      )
    )
  );

  updateCamfilRequisitionSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateCamfilRequisitionSuccess),
      map(() =>
        displaySuccessMessage({
          message: 'camfil.account.approvals.requisition_updated.text',
        })
      )
    )
  );

  updateCamfilRequisitionAddress$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateCamfilRequisitionAddress),
      mapToPayload(),
      mergeMap(({ requisition, address }) =>
        this.requisitionsService.updateCamfilRequisitionAddress(requisition.id, address).pipe(
          map(() => updateCamfilRequisitionAddressSuccess({ requisition, address })),
          mapErrorToAction(updateCamfilRequisitionFail)
        )
      )
    )
  );

  createCamfilRequisition = createEffect(() =>
    this.actions$.pipe(
      ofType(createCamfilRequisition),
      withLatestFrom(this.store.select(getCurrentBasketId)),
      mergeMap(([, basketId]) =>
        this.requisitionsService.createCamfilRequisition(basketId).pipe(
          tap(() => this.router.navigate(['/checkout/receipt'])),
          concatMap((requisitions: CamfilRequisition[]) => [
            createCamfilRequisitionSuccess({ requisitions }),
            submitBasketSuccess(),
          ]),
          mapErrorToAction(createCamfilRequisitionFail)
        )
      )
    )
  );

  removeProductsFromCamfilRequisition$ = createEffect(() =>
    this.actions$.pipe(
      ofType(removeProductFromCamfilRequisition),
      mapToPayload(),
      concatMap(({ lineItemId, requisitionId }) =>
        this.requisitionsService.removeProductsFromCamfilRequisition(lineItemId, requisitionId).pipe(
          map(() => removeProductFromCamfilRequisitionSuccess({ requisitionId })),
          mapErrorToAction(removeProductFromCamfilRequisitionFail)
        )
      )
    )
  );

  removeLastProductFromCamfilRequisition$ = createEffect(() =>
    this.actions$.pipe(
      ofType(removeLastProductFromCamfilRequisition),
      mapToPayload(),
      concatMap(({ lineItemId, requisitionId }) =>
        this.requisitionsService.removeProductsFromCamfilRequisition(lineItemId, requisitionId).pipe(
          map(() => removeLastProductFromCamfilRequisitionSuccess({ requisitionId })),
          mapErrorToAction(removeLastProductFromCamfilRequisitionFail)
        )
      )
    )
  );

  removeLastProductFromCamfilRequisitionSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(removeLastProductFromCamfilRequisitionSuccess),
      map(() =>
        displaySuccessMessage({
          message: 'camfil.account.approvals.last_product_removed.text',
        })
      ),
      tap(() => this.router.navigate(['/account/requisitions/approver']))
    )
  );

  removeProductsFromCamfilRequisitionSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(removeProductFromCamfilRequisitionSuccess),
      map(() =>
        displaySuccessMessage({
          message: 'camfil.account.approvals.product_removed.text',
        })
      )
    )
  );

  // ------- Line Items Attributes -------
  addCamfilRequisitionLineItemAttribute$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addCamfilRequisitionLineItemAttribute),
      mapToPayload(),
      mergeMap(({ requisitionId, lineItemId, lineItemAttribute }) =>
        this.requisitionsService
          .addLineItemAttribute(requisitionId, lineItemId, lineItemAttribute)
          .pipe(
            map(addCamfilRequisitionLineItemAttributeSuccess),
            mapErrorToAction(addCamfilRequisitionLineItemAttributeFail)
          )
      )
    )
  );

  updateCamfilRequisitionLineItemAttribute$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateCamfilRequisitionLineItemAttribute),
      mapToPayload(),
      mergeMap(payload =>
        this.requisitionsService
          .updateLineItemAttribute(payload.requisitionId, payload.lineItemId, payload.lineItemAttribute)
          .pipe(
            map(updateCamfilRequisitionLineItemAttributeSuccess),
            mapErrorToAction(updateCamfilRequisitionLineItemAttributeFail)
          )
      )
    )
  );

  deleteLineItemAttributte$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteCamfilRequisitionLineItemAttribute),
      mapToPayload(),
      mergeMap(({ requisitionId, lineItemId, lineItemAttribute }) =>
        this.requisitionsService
          .deleteLineItemAttribute(requisitionId, lineItemId, lineItemAttribute)
          .pipe(
            map(deleteCamfilRequisitionLineItemAttributeSuccess),
            mapErrorToAction(deleteCamfilRequisitionLineItemAttributeFail)
          )
      )
    )
  );

  // Line items update

  updateCamfilRequisitionLineItem$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateCamfilRequisitionLineItem),
      mapToPayload(),
      mergeMap(({ requisitionId, lineItemUpdate }) =>
        this.requisitionsService.updateLineItem(requisitionId, lineItemUpdate).pipe(
          map(() => updateCamfilRequisitionLineItemSuccess({ requisitionId, lineItemUpdate })),
          mapErrorToAction(updateCamfilRequisitionLineItemFail)
        )
      )
    )
  );

  approveCamfilRequisitionLineItems$ = createEffect(() =>
    this.actions$.pipe(
      ofType(approveCamfilRequisitionLineItems),
      mapToPayload(),
      mergeMap(({ requisitionId, lineItemIds, requisition }) =>
        this.requisitionsService.approveSelectedLineItems(requisitionId, lineItemIds, requisition).pipe(
          map(() => createOrderFromApprovedRequisitionLineItems({ requisition, lineItemIds })),
          mapErrorToAction(approveCamfilRequisitionLineItemsFail)
        )
      )
    )
  );

  createOrderWithApprovedLineItems$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createOrderFromApprovedRequisitionLineItems),
      mapToPayload(),
      mergeMap(({ requisition, lineItemIds }) =>
        this.requisitionsService.createOrderFromApprovedRequisition(requisition.id, lineItemIds).pipe(
          map(() => createOrderFromApprovedRequisitionLineItemsSuccess({ requisition, lineItemIds })),
          mapErrorToAction(createOrderFromApprovedRequisitionFail)
        )
      )
    )
  );

  updateMultipleCamfilRequisitionStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateMultipleCamfilRequisitionStatus),
      mapToPayload(),
      concatMap(payload =>
        this.requisitionsService
          .updateMultipleCamfilRequisitionStatus(payload.requisitionIds, payload.status, payload.approvalComment)
          .pipe(
            // TODO: Change effect to createOrderFromMultipleApprovedRequisition
            map(requisition =>
              requisition.approval.statusCode === CamfilRequisitionStatusCodes.Approved
                ? createOrderFromApprovedRequisition({
                    requisitionId: requisition.id,
                  })
                : updateCamfilRequisitionStatusSuccess({
                    requisition,
                    status: requisition.approval.status,
                  })
            ),
            mapErrorToAction(updateMultipleCamfileRequisitionStatusFail)
          )
      )
    )
  );

  updateMultipleCamfileRequisitionStatusFail$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateMultipleCamfileRequisitionStatusFail),
      map(() =>
        displayErrorMessage({
          message: 'camfil.account.approvals.status_update.fail.text',
        })
      )
    )
  );
}
