import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { concatMap, map, mergeMap, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { getCamCardCustomers, loadCustomers } from 'src/app/extensions/cam-cards/store/cam-card';

import { ProductCompletenessLevel } from 'ish-core/models/product/product.model';
import { displaySuccessMessage } from 'ish-core/store/core/messages';
import { getCurrentBasketId, submitBasketSuccess } from 'ish-core/store/customer/basket';
import { loadProductIfNotLoaded } from 'ish-core/store/shopping/products';
import { mapErrorToAction, mapToPayload, mapToPayloadProperty } from 'ish-core/utils/operators';

import { RequisitionsService } from '../../services/requisitions/requisitions.service';

import {
  addProductToRequisition,
  addProductToRequisitionSuccess,
  createRequisition,
  createRequisitionFail,
  createRequisitionSuccess,
  getRequisitionData,
  loadRequisition,
  loadRequisitionFail,
  loadRequisitionSuccess,
  loadRequisitions,
  loadRequisitionsFail,
  loadRequisitionsSuccess,
  removeProductsFromRequisition,
  removeProductsFromRequisitionSuccess,
  updateRequisition,
  updateRequisitionFail,
  updateRequisitionLineItemAttribute,
  updateRequisitionLineItemAttributeFail,
  updateRequisitionLineItemAttributeSuccess,
  updateRequisitionStatus,
  updateRequisitionStatusFail,
  updateRequisitionStatusSuccess,
  updateRequisitionSuccess,
} from './requisitions.actions';

@Injectable()
export class RequisitionsEffects {
  constructor(
    private actions$: Actions,
    private requisitionsService: RequisitionsService,
    private router: Router,
    private store: Store
  ) {}

  loadRequisitions$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadRequisitions),
      concatMap(() =>
        this.requisitionsService.getRequisitions().pipe(
          map(requisitions => loadRequisitionsSuccess({ requisitions })),
          mapErrorToAction(loadRequisitionsFail)
        )
      )
    )
  );

  getRequisitionData$ = createEffect(() =>
    this.actions$.pipe(
      ofType(getRequisitionData),
      mapToPayload(),
      mergeMap(({ requisitionId }) =>
        this.requisitionsService.getRequisition(requisitionId).pipe(
          map(requisition => loadRequisitionSuccess({ requisition })),
          mapErrorToAction(loadRequisitionFail)
        )
      )
    )
  );

  loadRequisition$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadRequisition),
      mapToPayload(),
      withLatestFrom(this.store.pipe(select(getCamCardCustomers))),
      mergeMap(([requisitionId, customers]) => {
        const actions = [getRequisitionData(requisitionId)] as any[];

        if (!customers.length) {
          actions.push(loadCustomers());
        }
        return actions;
      })
    )
  );

  /**
   * After selecting and successfully loading a requisition, triggers a LoadProduct action
   * for each product that is missing in the current product entities state.
   */
  loadProductsForSelectedRequisition$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadRequisitionSuccess),
      mapToPayloadProperty('requisition'),
      switchMap(requisition => [
        ...requisition.lineItems.map(({ productSKU }) =>
          loadProductIfNotLoaded({ sku: productSKU, level: ProductCompletenessLevel.List })
        ),
      ])
    )
  );

  updateRequisitionStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateRequisitionStatus),
      mapToPayload(),
      concatMap(payload =>
        this.requisitionsService
          .updateRequisitionStatus(payload.requisitionId, payload.status, payload.approvalComment)
          .pipe(
            tap(requisition =>
              /* ToDo: use only relative routes */
              this.router.navigate([
                `/account/requisitions/approver/${requisition.id}`,
                { status: requisition.approval?.statusCode },
              ])
            ),
            map(requisition =>
              updateRequisitionStatusSuccess({
                requisition,
                requisitionStatus: requisition.approval.status,
              })
            ),
            mapErrorToAction(updateRequisitionStatusFail)
          )
      )
    )
  );

  updateRequisitionStatusSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateRequisitionStatusSuccess),
      mapToPayload(),
      map(payload =>
        displaySuccessMessage({
          message:
            payload.requisitionStatus === 'approved'
              ? 'camfil.account.approvals.status_update.approved'
              : 'camfil.account.approvals.status_update.reject',
        })
      )
    )
  );

  addProductToRequisition$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addProductToRequisition),
      mapToPayload(),
      concatMap(payload =>
        this.requisitionsService.addProductToRequisition(payload.sku, payload.quantity, payload.requisitionId).pipe(
          map(requisition => updateRequisitionSuccess({ requisition })),
          mapErrorToAction(updateRequisitionStatusFail)
        )
      )
    )
  );

  addProductsFromRequisitionSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addProductToRequisitionSuccess),
      map(() =>
        displaySuccessMessage({
          message: 'camfil.account.approvals.product_added.text',
        })
      )
    )
  );

  removeProductsFromRequisition$ = createEffect(() =>
    this.actions$.pipe(
      ofType(removeProductsFromRequisition),
      mapToPayload(),
      concatMap(payload =>
        this.requisitionsService.removeProductsFromRequisition(payload.lineItemIds, payload.requisitionId).pipe(
          map(requisition => removeProductsFromRequisitionSuccess({ requisition })),
          mapErrorToAction(updateRequisitionStatusFail)
        )
      )
    )
  );

  removeProductsFromRequisitionSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(removeProductsFromRequisitionSuccess),
      map(() =>
        displaySuccessMessage({
          message: 'camfil.account.approvals.product_removed.text',
        })
      )
    )
  );

  updateRequisitionLineItemAttribute$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateRequisitionLineItemAttribute),
      mapToPayload(),
      mergeMap(payload =>
        this.requisitionsService
          .updateLineItemAttribute(payload.requisitionId, payload.lineItemIds, payload.lineItemAttribute)
          .pipe(
            map(updateRequisitionLineItemAttributeSuccess),
            mapErrorToAction(updateRequisitionLineItemAttributeFail)
          )
      )
    )
  );

  updateRequisition = createEffect(() =>
    this.actions$.pipe(
      ofType(updateRequisition),
      mapToPayload(),
      mergeMap(payload => {
        const { requisition } = payload;
        return this.requisitionsService.updateRequisition(requisition).pipe(
          map(req => updateRequisitionSuccess({ requisition: req })),
          mapErrorToAction(updateRequisitionFail)
        );
      })
    )
  );

  updateRequisitionSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateRequisitionSuccess),
      map(() =>
        displaySuccessMessage({
          message: 'camfil.account.approvals.requisition_updated.text',
        })
      )
    )
  );

  createRequisition = createEffect(() =>
    this.actions$.pipe(
      ofType(createRequisition),
      withLatestFrom(this.store.select(getCurrentBasketId)),
      mergeMap(([, basketId]) =>
        this.requisitionsService.createRequisition(basketId).pipe(
          tap(() => this.router.navigate(['/checkout/receipt'])),
          concatMap(requisition => [createRequisitionSuccess({ requisition }), submitBasketSuccess()]),
          mapErrorToAction(createRequisitionFail)
        )
      )
    )
  );
}
