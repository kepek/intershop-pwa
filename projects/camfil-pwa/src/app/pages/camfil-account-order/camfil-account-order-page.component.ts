import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { CamfilPwaFacade } from 'camfil-pwa/facades/camfil-pwa.facade';
import { CamfilOrder } from 'camfil-pwa/models/camfil-order/camfil-order.model';
import { Observable, Subject } from 'rxjs';

import { AppFacade } from 'ish-core/facades/app.facade';
import { DeviceType } from 'ish-core/models/viewtype/viewtype.types';

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
  order$: Observable<CamfilOrder>;
  deviceType$: Observable<DeviceType>;

  private destroy$ = new Subject();

  constructor(private camfilAccountFacade: CamfilPwaFacade, private appFacade: AppFacade) {}

  ngOnInit() {
    this.order$ = this.camfilAccountFacade.selectedOrder$;
    this.deviceType$ = this.appFacade.deviceType$;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
