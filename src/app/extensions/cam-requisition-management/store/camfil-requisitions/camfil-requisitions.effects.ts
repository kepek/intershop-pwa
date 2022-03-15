import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { concatMap, filter, map, mergeMap, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { getCamCardCustomers, loadCustomers } from 'src/app/extensions/cam-cards/store/cam-card';

import { ProductCompletenessLevel } from 'ish-core/models/product/product.model';
import { displayErrorMessage, displaySuccessMessage } from 'ish-core/store/core/messages';
import { ofUrl, selectRouteParam } from 'ish-core/store/core/router';
import { getCurrentBasketId, submitBasketSuccess } from 'ish-core/store/customer/basket';
import { getProduct, getProducts, loadProductIfNotLoaded } from 'ish-core/store/shopping/products';
import { mapErrorToAction, mapToPayload, mapToPayloadProperty } from 'ish-core/utils/operators';

import { CamfilRequisitionsService } from '../../services/requisitions/camfil-requisitions.service';

import {
  addProductToCamfilRequisition,
  addProductToCamfilRequisitionSuccess,
  checkProductAvailabilityFail,
  createCamfilRequisition,
  createCamfilRequisitionFail,
  createCamfilRequisitionSuccess,
  createOrderFromApprovedRequisition,
  createOrderFromApprovedRequisitionFail,
  createOrderFromApprovedRequisitionSuccess,
  getCamfilRequisitionData,
  loadCamfilRequisition,
  loadCamfilRequisitionFail,
  loadCamfilRequisitions,
  loadCamfilRequisitionsFail,
  loadCamfilRequisitionsSuccess,
  loadCamfilRequisitionsuccess,
  removeProductsFromCamfilRequisition,
  removeProductsFromCamfilRequisitionSuccess,
  updateCamfilRequisition,
  updateCamfilRequisitionFail,
  updateCamfilRequisitionLineItemAttribute,
  updateCamfilRequisitionLineItemAttributeFail,
  updateCamfilRequisitionLineItemAttributeSuccess,
  updateCamfilRequisitionStatus,
  updateCamfilRequisitionStatusFail,
  updateCamfilRequisitionStatusSuccess,
  updateCamfilRequisitionSuccess,
} from './camfil-requisitions.actions';
import { getSelectedCamfilRequisition, getSelectedCamfilRequisitionId } from './camfil-requisitions.selectors';
import { combineLatest, of } from 'rxjs';

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

  checkProductsAvailabilityForSelectedCamfilOrder$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadCamfilRequisitionsuccess),
      mapToPayload(),
      map(({ requisition }) =>
        requisition?.lineItems.reduce<string[]>(
          (acc, val) => (acc.find(sku => sku === val.productSKU) ? acc : [...acc, val.productSKU]),
          []
        )
      ),
      switchMap(skus =>
        this.store.pipe(
          select(getProducts, { skus }),
          filter(products => products.length === skus.length)
        )
      ),
      map(products =>
        products.map(({ availability, failed, sku }) => ({ sku, availability: failed ? false : availability }))
      ),
      map(availabilities => availabilities.every(({ availability }) => !!availability)),
      withLatestFrom(this.store.pipe(select(getSelectedCamfilRequisition))),
      map(([canApprove, requisition]) => {
        const newRequisition = {
          ...requisition,
          canApprove,
        };
        return updateCamfilRequisition({ requisition: newRequisition });
      })
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
              requisition.approval.statusCode === 'APPROVED'
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

  updateCamfilRequisitionStatusSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateCamfilRequisitionStatusSuccess),
      mapToPayload(),
      mergeMap(payload => [
        displaySuccessMessage({
          message:
            payload.status === 'APPROVED'
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
      switchMap(payload => combineLatest([of(payload), this.store.pipe(select(getProduct, { sku: payload.sku }))])),
      concatMap(([payload, product]) => {
        if (!product.availability) {
          return this.requisitionsService
            .addProductToCamfilRequisition(payload.sku, payload.quantity, payload.requisitionId)
            .pipe(
              map(requisition => updateCamfilRequisitionSuccess({ requisition })),
              mapErrorToAction(updateCamfilRequisitionStatusFail)
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

  removeProductsFromCamfilRequisition$ = createEffect(() =>
    this.actions$.pipe(
      ofType(removeProductsFromCamfilRequisition),
      mapToPayload(),
      concatMap(payload =>
        this.requisitionsService.removeProductsFromCamfilRequisition(payload.lineItemIds, payload.requisitionId).pipe(
          map(requisition => removeProductsFromCamfilRequisitionSuccess({ requisition })),
          mapErrorToAction(updateCamfilRequisitionStatusFail)
        )
      )
    )
  );

  removeProductsFromCamfilRequisitionSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(removeProductsFromCamfilRequisitionSuccess),
      map(() =>
        displaySuccessMessage({
          message: 'camfil.account.approvals.product_removed.text',
        })
      )
    )
  );

  updateCamfilRequisitionLineItemAttribute$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateCamfilRequisitionLineItemAttribute),
      mapToPayload(),
      mergeMap(payload =>
        this.requisitionsService
          .updateLineItemAttribute(payload.requisitionId, payload.lineItemIds, payload.lineItemAttribute)
          .pipe(
            map(updateCamfilRequisitionLineItemAttributeSuccess),
            mapErrorToAction(updateCamfilRequisitionLineItemAttributeFail)
          )
      )
    )
  );

  updateCamfilRequisition = createEffect(() =>
    this.actions$.pipe(
      ofType(updateCamfilRequisition),
      mapToPayload(),
      mergeMap(payload => {
        const { requisition } = payload;
        return this.requisitionsService.updateCamfilRequisition(requisition).pipe(
          map(req => updateCamfilRequisitionSuccess({ requisition: req })),
          mapErrorToAction(updateCamfilRequisitionFail)
        );
      })
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

  createCamfilRequisition = createEffect(() =>
    this.actions$.pipe(
      ofType(createCamfilRequisition),
      withLatestFrom(this.store.select(getCurrentBasketId)),
      mergeMap(([, basketId]) =>
        this.requisitionsService.createCamfilRequisition(basketId).pipe(
          tap(() => this.router.navigate(['/checkout/receipt'])),
          concatMap(requisition => [createCamfilRequisitionSuccess({ requisition }), submitBasketSuccess()]),
          mapErrorToAction(createCamfilRequisitionFail)
        )
      )
    )
  );
}
