import { Injectable, OnDestroy } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { RxState } from '@rx-angular/state';
import { distinctUntilChanged, filter, map, switchMap, tap } from 'rxjs/operators';

import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { LineItem } from 'ish-core/models/line-item/line-item.model';
import { selectRouteParam, selectUrl } from 'ish-core/store/core/router';
import { getProducts } from 'ish-core/store/shopping/products';
import { whenTruthy } from 'ish-core/utils/operators';

import { CamfilRequisition } from '../models/camfil-requisition/camfil-requisition.model';
import {
  addProductToCamfilRequisition,
  approveCamfilRequisitionLineItems,
  getCamfilRequisition,
  getCamfilRequisitionsError,
  getCamfilRequisitionsLoading,
  loadCamfilRequisition,
  removeMultipleProductsFromCamfilRequisition,
  removeProductFromCamfilRequisition,
  updateCamfilRequisitionStatus,
} from '../store/camfil-requisitions';
import { CamCardItemComment, CamCardMeasurement } from '../../cam-cards/models/cam-card/cam-card.model';

@Injectable()
export class CamfilRequisitionContextFacade
  extends RxState<{
    id: string;
    loading: boolean;
    error: HttpError;
    entity: CamfilRequisition;
    partiallyApproved: boolean;
    lineItems: LineItem[];
    unavailableProducts: { sku: string; availability: boolean }[];
    view: 'buyer' | 'approver';
  }>
  implements OnDestroy {
  constructor(private store: Store) {
    super();

    this.connect('id', this.store.pipe(select(selectRouteParam('requisitionId'))));

    this.connect('loading', this.store.pipe(select(getCamfilRequisitionsLoading)));

    this.connect('error', this.store.pipe(select(getCamfilRequisitionsError)));

    this.connect(
      'entity',
      this.select('id').pipe(
        whenTruthy(),
        distinctUntilChanged(),
        tap(requisitionId => this.store.dispatch(loadCamfilRequisition({ requisitionId }))),
        switchMap(requisitionId =>
          this.store.pipe(
            select(getCamfilRequisition(requisitionId)),
            whenTruthy(),
            map(entity => entity as CamfilRequisition)
          )
        ),
        whenTruthy()
      )
    );

    this.connect(
      'unavailableProducts',
      this.select('entity').pipe(
        whenTruthy(),
        distinctUntilChanged(),
        map(({ lineItems }) =>
          lineItems?.reduce<string[]>(
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
        map(unavailableProducts => unavailableProducts.filter(product => !product.availability))
      )
    );

    this.connect(
      'view',
      this.store.pipe(
        select(selectUrl),
        map(url => (url.includes('/buyer') ? 'buyer' : 'approver'))
      )
    );

    this.connect(
      'partiallyApproved',
      this.select('entity').pipe(
        whenTruthy(),
        distinctUntilChanged(),
        map(({ partiallyApproved }) => partiallyApproved)
      )
    );

    this.connect(
      'lineItems',
      this.select('entity').pipe(
        whenTruthy(),
        distinctUntilChanged(),
        map(({ lineItems }) => lineItems)
      )
    );
  }

  approveRequisition$() {
    this.store.dispatch(
      updateCamfilRequisitionStatus({
        requisitionId: this.get('entity', 'id'),
        status: 'APPROVED',
      })
    );
  }

  rejectRequisition$(comment?: string) {
    this.store.dispatch(
      updateCamfilRequisitionStatus({
        requisitionId: this.get('entity', 'id'),
        status: 'REJECTED',
        approvalComment: comment,
      })
    );
  }

  addProductToCamfilRequisition(item: {
    sku: string;
    quantity: number;
    boxLabel?: CamCardItemComment;
    measurements?: CamCardMeasurement;
  }) {
    this.store.dispatch(
      addProductToCamfilRequisition({
        requisitionId: this.get('entity', 'id'),
        item,
      })
    );
  }

  removeSelectedLineItem(lineItemId: string) {
    this.store.dispatch(
      removeProductFromCamfilRequisition({
        lineItemId,
        requisitionId: this.get('entity', 'id'),
      })
    );
  }

  removeMultipleProductsFromCamfilRequisition(lineItemsIds: string[]) {
    this.store.dispatch(
      removeMultipleProductsFromCamfilRequisition({
        lineItemsIds,
        requisitionId: this.get('entity', 'id'),
      })
    );
  }

  approveCamfilRequisitionLineItem(lineItemIds: string[]) {
    this.store.dispatch(
      approveCamfilRequisitionLineItems({
        requisitionId: this.get('entity', 'id'),
        lineItemIds,
        requisition: this.get('entity'),
      })
    );
  }
}
