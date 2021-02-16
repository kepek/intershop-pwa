import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiService } from 'ish-core/services/api/api.service';

import { OrderData } from '../../models/order/order.interface';
import { OrderMapper } from '../../models/order/order.mapper';
import { Order } from '../../models/order/order.model';

@Injectable({ providedIn: 'root' })
export class OrderService {
  constructor(private apiService: ApiService) {}

  getOrder(orderId: string): Observable<Order> {
    if (!orderId) {
      return throwError('getOrder() called without orderId');
    }

    return this.apiService.get<OrderData>(`camfilorder/${orderId}`).pipe(map(OrderMapper.camfilfromData));
  }

  getOrders(): Observable<Order[]> {
    return this.apiService.get('camfilorder').pipe(map(OrderMapper.camfilfromListData));
  }

  getOrderLineItems(orderId: string) {
    if (!orderId) {
      return throwError('getOrderLineItems() called without orderId');
    }

    return this.apiService.get<OrderData>(`camfilorder/${orderId}/camfilorderline`).pipe(map(lineItems => lineItems));
  }

  getOrderTrackAndTrace(orderId: string) {
    if (!orderId) {
      return throwError('getOrderTrackAndTrace() called without orderId');
    }

    return this.apiService
      .get<OrderData>(`camfilorder/${orderId}/trackandtrace`)
      .pipe(map(trackAndTrace => trackAndTrace));
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
