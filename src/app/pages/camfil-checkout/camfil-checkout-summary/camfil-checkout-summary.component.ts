import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { BasketView } from 'ish-core/models/basket/basket.model';

@Component({
  selector: 'camfil-checkout-summary',
  templateUrl: './camfil-checkout-summary.component.html',
  styleUrls: ['./camfil-checkout-summary.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilCheckoutSummaryComponent {
  @Input() basket: BasketView;
  @Input() isConfirmed;
  @Output() update = new EventEmitter();

  constructor(private checkoutFacade: CheckoutFacade, private router: Router) {}

  submitOrder() {
    this.update.emit();

    this.checkoutFacade.continue(5);
  }

  continueShopping() {
    this.router.navigate(['/account/camcards']);
  }
}
