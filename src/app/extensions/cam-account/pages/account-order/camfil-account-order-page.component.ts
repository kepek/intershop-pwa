import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { AppFacade } from 'ish-core/facades/app.facade';
import { DeviceType } from 'ish-core/models/viewtype/viewtype.types';

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
  order$: Observable<Order>;
  deviceType$: Observable<DeviceType>;

  private destroy$ = new Subject();

  constructor(private camAccountFacade: CamAccountFacade, private appFacade: AppFacade) {}

  ngOnInit() {
    this.order$ = this.camAccountFacade.selectedOrder$;
    this.deviceType$ = this.appFacade.deviceType$;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
