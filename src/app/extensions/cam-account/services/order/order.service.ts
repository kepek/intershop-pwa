import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { defaultIfEmpty, map } from 'rxjs/operators';

import { BasketData } from 'ish-core/models/basket/basket.interface';
import { BasketMapper } from 'ish-core/models/basket/basket.mapper';
import { Basket } from 'ish-core/models/basket/basket.model';
import { ApiService, unpackEnvelope } from 'ish-core/services/api/api.service';

import { OrderLineItemData } from '../../models/order-line-item/order-line-item.interface';
import { OrderLineItemMapper } from '../../models/order-line-item/order-line-item.mapper';
import { OrderLineItem } from '../../models/order-line-item/order-line-item.model';
import { OrderData } from '../../models/order/order.interface';
import { OrderMapper } from '../../models/order/order.mapper';
import { Order } from '../../models/order/order.model';
import { TrackAndTracesMapper } from '../../models/track-and-trace/track-and-trace.mapper';

@Injectable({ providedIn: 'root' })
export class OrderService {
  constructor(private apiService: ApiService) {}

  getOrder(orderId: string): Observable<Order> {
    if (!orderId) {
      return throwError('getOrder() called without orderId');
    }

    return this.apiService
      .get<OrderData>(`camfilorder/${orderId}`)
      .pipe(map(orderData => OrderMapper.fromData(orderData)));
  }

  getOrders(): Observable<Order[]> {
    return this.apiService.get('camfilorder').pipe(
      unpackEnvelope(),
      map((orders: OrderData[]) => orders.map(order => OrderMapper.fromData(order))),
      defaultIfEmpty([])
    );
  }

  getOrderLineItems(orderId: string) {
    if (!orderId) {
      return throwError('getOrderLineItems() called without orderId');
    }

    return this.apiService.get<OrderData>(`camfilorder/${orderId}/camfilorderline`).pipe(
      unpackEnvelope(),
      map((lineItemsData: OrderLineItemData[]) =>
        lineItemsData.map(lineItem => OrderLineItemMapper.fromData(lineItem))
      ),
      defaultIfEmpty<OrderLineItem[]>([])
    );
  }

  getOrderTrackAndTrace(orderId: string) {
    if (!orderId) {
      return throwError('getOrderTrackAndTrace() called without orderId');
    }

    return this.apiService
      .get<OrderData>(`camfilorder/${orderId}/trackandtrace`)
      .pipe(map(trackAndTrace => TrackAndTracesMapper.fromData(trackAndTrace[0])));
  }

  getOrderAdditionalTotalCost(orderId: string) {
    if (!orderId) {
      return throwError('getOrderTrackAndTrace() called without orderId');
    }

    return this.apiService
      .get<OrderData>(`camfilorder/${orderId}/additionaltotalcost`)
      .pipe(map(additionalTotalCost => additionalTotalCost));
  }

  createOrderDuplicate(orderId: string): Observable<Basket> {
    if (!orderId) {
      return throwError('createOrderDuplicate() called without orderId');
    }

    return this.apiService
      .post<BasketData>(`camfilorder/${orderId}/`)
      .pipe(map(orderData => BasketMapper.fromData(orderData)));
  }
}
