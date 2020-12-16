import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { Price } from 'ish-core/models/price/price.model';

@Component({
  selector: 'camfil-checkout-list',
  templateUrl: './camfil-checkout-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./camfil-checkout-list.component.scss'],
})
export class CamfilCheckoutListComponent {
  @Input() order;

  totalPrice(): Price {
    const price: Price = {
      type: 'Money',
      currency: 'USD',
      value: 0,
    };

    const items = this.order && this.order.lineItems;

    items.forEach(element => {
      price.currency = element.price.currency;
      price.value = price.value + element.totals?.total.gross;
    });

    return price;
  }

  totalTax(): Price {
    const price: Price = {
      type: 'Money',
      currency: 'USD',
      value: 0,
    };

    const items = this.order && this.order.lineItems;

    items.map(element => {
      price.currency = element.totals?.salesTaxTotal.currency;
      price.value = price.value + element.totals?.salesTaxTotal.value;
    });
    return price;
  }

  discount(): Price {
    const price: Price = {
      type: 'Money',
      currency: 'USD',
      value: 0,
    };

    const items = this.order && this.order.lineItems;

    items.map(element => {
      price.currency = element.price.currency;
      price.value = price.value + (element.totals?.total.gross - element.totals?.undiscountedTotal.gross);
    });

    return price;
  }
}
