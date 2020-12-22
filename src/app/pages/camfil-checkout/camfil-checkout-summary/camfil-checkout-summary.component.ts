import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { BasketView } from 'ish-core/models/basket/basket.model';

@Component({
  selector: 'camfil-checkout-summary',
  templateUrl: './camfil-checkout-summary.component.html',
  styleUrls: ['./camfil-checkout-summary.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilCheckoutSummaryComponent implements OnInit {
  @Input() basket: BasketView;

  constructor(private checkoutFacade: CheckoutFacade) {}

  ngOnInit() {
    this.checkoutFacade.setBasketPayment('ISH_INVOICE');
  }

  submitOrder() {
    this.checkoutFacade.continue(5);
  }
}
