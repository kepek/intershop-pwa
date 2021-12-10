import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CheckoutFacade as CamfilCheckoutFacade } from 'camfil-pwa/facades/checkout.facade';
import { Observable } from 'rxjs';

import { Basket } from 'ish-core/models/basket/basket.model';
import { Bucket } from 'ish-core/models/bucket/bucket.model';
import { HttpError } from 'ish-core/models/http-error/http-error.model';
import { Order } from 'ish-core/models/order/order.model';

@Component({
  selector: 'camfil-checkout-receipt-page',
  templateUrl: './camfil-checkout-receipt-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilCheckoutReceiptPageComponent implements OnInit {
  loading$: Observable<boolean>;
  order$: Observable<Order>;
  submittedBasket$: Observable<Basket>;
  submittedBuckets$: Observable<Bucket[]>;
  basketError$: Observable<HttpError>;

  constructor(private checkoutFacade: CamfilCheckoutFacade) {}

  ngOnInit() {
    this.order$ = this.checkoutFacade.selectedOrder$;
    this.loading$ = this.checkoutFacade.basketLoading$;
    this.submittedBasket$ = this.checkoutFacade.submittedBasket$;
    this.submittedBuckets$ = this.checkoutFacade.submittedBuckets$;
    this.basketError$ = this.checkoutFacade.basketError$;
  }
}
