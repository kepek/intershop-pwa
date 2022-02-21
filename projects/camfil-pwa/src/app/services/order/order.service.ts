import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { OrderMapper } from 'camfil-pwa/models/order/order.mapper';
import { Order } from 'camfil-pwa/models/order/order.model';
import { CamfilUrlService } from 'camfil-pwa/services/camfil-url/camfil-url.service';
import { Observable, of, throwError } from 'rxjs';
import { concatMap, map, withLatestFrom } from 'rxjs/operators';

import { CamfilIdentityParams } from 'ish-core/identity-provider/camfil.identity-provider';
import { OrderData } from 'ish-core/models/order/order.interface';
import { ApiService } from 'ish-core/services/api/api.service';
import { OrderService as IshOrderService } from 'ish-core/services/order/order.service';
import { getCurrentLocale } from 'ish-core/store/core/configuration';

@Injectable({ providedIn: 'root' })
export class OrderService extends IshOrderService {
  constructor(protected apiService: ApiService, protected store: Store, protected camfilUrlService: CamfilUrlService) {
    super(apiService, store);
  }

  /**
   *  Checks, if RedirectUrls are requested by the server and sends them if it is necessary.
   * @param order            The order.
   * @param lang            The language code of the current locale, e.g. en_US
   * @returns               The (updated) order.
   */
  protected sendRedirectUrlsIfRequired(order: Order, lang: string): Observable<Order> {
    const loc = this.camfilUrlService.getBaseURL(true);
    if (
      order.orderCreation &&
      order.orderCreation.status === 'STOPPED' &&
      order.orderCreation.stopAction.type === 'Workflow' &&
      order.orderCreation.stopAction.exitReason === 'redirect_urls_required'
    ) {
      const body = {
        orderCreation: {
          redirect: {
            cancelUrl: `${loc}/checkout/payment;lang=${lang}?redirect=cancel&orderId=${order.id}`,
            failureUrl: `${loc}/checkout/payment;lang=${lang}?redirect=failure&orderId=${order.id}`,
            successUrl: `${loc}/checkout/receipt;lang=${lang}?redirect=success&orderId=${order.id}`,
          },
          status: 'CONTINUE',
        },
      };
      return this.apiService
        .patch(`orders/${order.id}`, body, {
          headers: this.orderHeaders,
        })
        .pipe(map(OrderMapper.fromData));
    } else {
      return of(order);
    }
  }

  createOrder(basketId: string, termsAndConditionsAccepted: boolean = false): Observable<Order> {
    const params = new HttpParams().set('include', this.allOrderIncludes.join());

    if (!basketId) {
      return throwError('createOrder() called without basketId');
    }

    const externalOrderReference = window?.sessionStorage?.getItem(CamfilIdentityParams.ERPEmployeeID) || undefined;

    const body = {
      basket: basketId,
      termsAndConditionsAccepted,
      externalOrderReference,
    };

    return this.apiService
      .post<OrderData>('orders', body, {
        headers: this.orderHeaders,
        params,
      })
      .pipe(
        map(payload => OrderMapper.fromData({ data: payload?.data?.[0] })),
        withLatestFrom(this.store.pipe(select(getCurrentLocale))),
        concatMap(([order, currentLocale]) => this.sendRedirectUrlsIfRequired(order, currentLocale?.lang))
      );
  }
}
