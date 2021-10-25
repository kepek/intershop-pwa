import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { BasketView } from 'ish-core/models/basket/basket.model';
import { Bucket } from 'ish-core/models/basket/bucket.model';

@Component({
  selector: 'camfil-checkout-header',
  templateUrl: './camfil-checkout-header.component.html',
  styleUrls: ['./camfil-checkout-header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilCheckoutHeaderComponent implements OnInit, OnChanges {
  @Input() basket: BasketView;
  @Input() buckets: Bucket[];
  @Input() isConfirmed;

  isLoggedIn$: Observable<boolean>;

  quantity = 0;

  constructor(private accountFacade: AccountFacade) {}

  ngOnInit() {
    this.quantity = this.totalProductQuantity();
    this.isLoggedIn$ = this.accountFacade.isLoggedIn$;
  }

  ngOnChanges() {
    this.quantity = this.totalProductQuantity();
  }

  totalProductQuantity() {
    if (!this.buckets) {
      return 0;
    }

    return this.buckets?.reduce((a, b) => a + b.lineItems?.reduce((c, d) => c + d.quantity.value, 0), 0);
  }
}
