import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Order } from 'camfil-pwa/models/order/order.model';
import { Observable } from 'rxjs';

import { AccountFacade } from 'ish-core/facades/account.facade';

@Component({
  selector: 'camfil-checkout-receipt-order',
  templateUrl: './camfil-checkout-receipt-order.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilCheckoutReceiptOrderComponent implements OnInit {
  @Input() order: Order;

  isLoggedIn$: Observable<boolean>;

  constructor(private accountFacade: AccountFacade) {}

  ngOnInit() {
    this.isLoggedIn$ = this.accountFacade.isLoggedIn$;
  }
}
