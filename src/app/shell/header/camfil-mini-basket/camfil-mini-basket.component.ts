// tslint:disable: ish-ordered-imports ban-specific-imports

import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { map } from 'rxjs/operators';

@Component({
  selector: 'camfil-mini-basket',
  templateUrl: './camfil-mini-basket.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./camfil-mini-basket.scss'],
})
export class CamfilMiniBasketComponent implements OnInit {
  private static DEFAULT_VALUE = 0;

  totalProductQuantity$: Observable<number>;

  constructor(private checkoutFacade: CheckoutFacade) {}

  ngOnInit() {
    this.totalProductQuantity$ = this.checkoutFacade.buckets$.pipe(
      map(buckets => {
        if (buckets) {
          return buckets?.reduce(
            (a, b) => a + b.lineItems?.reduce((c, d) => c + d.quantity.value, CamfilMiniBasketComponent.DEFAULT_VALUE),
            CamfilMiniBasketComponent.DEFAULT_VALUE
          );
        }

        return CamfilMiniBasketComponent.DEFAULT_VALUE;
      })
    );
  }
}
