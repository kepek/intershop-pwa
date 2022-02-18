import { Injectable } from '@angular/core';
import { OrderLineItemData } from 'camfil-pwa/models/camfil-order-line-item/camfil-order-line-item.interface';
import { CamfilOrderLineItemMapper } from 'camfil-pwa/models/camfil-order-line-item/camfil-order-line-item.mapper';
import { CamfilOrderLineItem } from 'camfil-pwa/models/camfil-order-line-item/camfil-order-line-item.model';
import { CamfilOrderTrackAndTraceMapper } from 'camfil-pwa/models/camfil-order-track-and-trace/camfil-order-track-and-trace.mapper';
import { CamfilOrderData } from 'camfil-pwa/models/camfil-order/camfil-order.interface';
import { CamfilOrderMapper } from 'camfil-pwa/models/camfil-order/camfil-order.mapper';
import { CamfilOrder } from 'camfil-pwa/models/camfil-order/camfil-order.model';
import { Observable, throwError } from 'rxjs';
import { defaultIfEmpty, map } from 'rxjs/operators';

import { BasketData } from 'ish-core/models/basket/basket.interface';
import { BasketMapper } from 'ish-core/models/basket/basket.mapper';
import { Basket } from 'ish-core/models/basket/basket.model';
import { ApiService, unpackEnvelope } from 'ish-core/services/api/api.service';

@Injectable({ providedIn: 'root' })
export class CamfilOrderService {
  constructor(private apiService: ApiService) {}

  getCamfilOrder(orderId: string): Observable<CamfilOrder> {
    if (!orderId) {
      return throwError('getCamfilOrder() called without orderId');
    }

    return this.apiService
      .get<CamfilOrderData>(`camfilorder/${orderId}`)
      .pipe(map(orderData => CamfilOrderMapper.fromData(orderData)));
  }

  getCamfilOrders(): Observable<CamfilOrder[]> {
    return this.apiService.get('camfilorder').pipe(
      unpackEnvelope(),
      map((orders: CamfilOrderData[]) => orders.map(order => CamfilOrderMapper.fromData(order))),
      defaultIfEmpty([])
    );
  }

  getCamfilOrderLineItems(orderId: string) {
    if (!orderId) {
      return throwError('getCamfilOrderLineItems() called without orderId');
    }

    return this.apiService.get<CamfilOrderData>(`camfilorder/${orderId}/camfilorderline`).pipe(
      unpackEnvelope(),
      map((lineItemsData: OrderLineItemData[]) =>
        lineItemsData.map(lineItem => CamfilOrderLineItemMapper.fromData(lineItem))
      ),
      defaultIfEmpty<CamfilOrderLineItem[]>([])
    );
  }

  getCamfilOrderTrackAndTrace(orderId: string) {
    if (!orderId) {
      return throwError('getCamfilOrderLineItems() called without orderId');
    }

    return this.apiService
      .get<CamfilOrderData>(`camfilorder/${orderId}/trackandtrace`)
      .pipe(map(trackAndTrace => CamfilOrderTrackAndTraceMapper.fromData(trackAndTrace[0])));
  }

  getCamfilOrderAdditionalTotalCost(orderId: string) {
    if (!orderId) {
      return throwError('getCamfilOrderAdditionalTotalCost() called without orderId');
    }

    return this.apiService
      .get<CamfilOrderData>(`camfilorder/${orderId}/additionaltotalcost`)
      .pipe(map(additionalTotalCost => additionalTotalCost));
  }

  cloneCamfilOrder(orderId: string): Observable<Basket> {
    if (!orderId) {
      return throwError('cloneCamfilOrder() called without orderId');
    }

    return this.apiService
      .post<BasketData>(`camfilorder/${orderId}/`)
      .pipe(map(orderData => BasketMapper.fromData(orderData)));
  }
}
