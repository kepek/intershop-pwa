import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { defaultIfEmpty, map } from 'rxjs/operators';

import { ApiService, unpackEnvelope } from 'ish-core/services/api/api.service';

import { OrderData } from '../../models/order/order.interface';
import { OrderMapper } from '../../models/order/order.mapper';
import { Order } from '../../models/order/order.model';
import { OrderLineItem } from '../../models/orderLineItem/orderLineItem.interface';
import { TrackAndTracesMapper } from '../../models/trackAndTrace/trackAndTrace.mapper';

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
      map((lineItemsData: OrderLineItem[]) => lineItemsData.map(lineItem => OrderMapper.fromLineItemData(lineItem))),
      defaultIfEmpty([])
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

  createOrderDuplicate(orderId: string) {
    if (!orderId) {
      return throwError('createOrderDuplicate() called without orderId');
    }

    return this.apiService.post(`camfilorder/${orderId}/`).pipe(map(createdOrder => createdOrder));
  }
}
