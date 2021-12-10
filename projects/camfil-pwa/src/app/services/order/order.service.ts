import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Order } from 'ish-core/models/order/order.model';
import { OrderService as IshOrderService } from 'ish-core/services/order/order.service';

@Injectable({ providedIn: 'root' })
export class OrderService extends IshOrderService {
  getOrder(orderId: string): Observable<Order> {
    return super.getOrder(orderId);
  }
}
