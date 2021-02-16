import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { CamAccountFacade } from '../../facades/cam-account.facade';
import { Order } from '../../models/order/order.model';

/**
 * The Order Page Container reads order data from store and displays them using the {@link OrderPageComponent}
 *
 */
@Component({
  selector: 'camfil-account-order-page',
  templateUrl: './camfil-account-order-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilAccountOrderPageComponent implements OnInit, OnDestroy {
  orders: Order[];
  order$: Observable<Order>;

  private destroy$ = new Subject();

  constructor(private camAccountFacade: CamAccountFacade) {}

  ngOnInit() {
    this.camAccountFacade
      .orders$()
      .pipe(takeUntil(this.destroy$))
      .subscribe(orders => {
        this.orders = orders;
        this.order$ = this.camAccountFacade.selectedOrder$;
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
