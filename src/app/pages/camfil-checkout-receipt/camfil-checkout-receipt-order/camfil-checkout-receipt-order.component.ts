import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Order } from 'camfil-pwa/models/order/order.model';
import { Observable } from 'rxjs';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { CheckoutFacade } from 'ish-core/facades/checkout.facade';

@Component({
  selector: 'camfil-checkout-receipt-order',
  templateUrl: './camfil-checkout-receipt-order.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilCheckoutReceiptOrderComponent implements OnInit {
  @Input() order: Order;

  isLoggedIn$: Observable<boolean>;
  isFreightCostInvalid$: Observable<boolean>;

  constructor(private accountFacade: AccountFacade, private checkoutFacade: CheckoutFacade) {}

  ngOnInit() {
    this.isLoggedIn$ = this.accountFacade.isLoggedIn$;
    this.isFreightCostInvalid$ = this.checkoutFacade.isFreightCostInvalid$;
  }
}
