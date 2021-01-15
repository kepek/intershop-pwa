import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { BasketView } from 'ish-core/models/basket/basket.model';
import { Bucket } from 'ish-core/models/basket/bucket.model';
import { whenTruthy } from 'ish-core/utils/operators';

@Component({
  templateUrl: './checkout-page.component.html',
  styleUrls: ['./checkout-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class CheckoutPageComponent implements OnInit, OnDestroy {
  basket$: Observable<BasketView>;
  basketId: string;
  shippingMethodId: string;
  buckets$: Observable<any[]>;
  buckets: Bucket[];
  emptyBuckets: Bucket[];

  private destroy$ = new Subject<void>();

  constructor(private checkoutFacade: CheckoutFacade, private shoppingFacade: ShoppingFacade) {}

  ngOnInit() {
    this.initBasket();
    this.shoppingFacade.loadBasketAddresses();
  }

  initBasket() {
    this.basket$ = this.checkoutFacade.basket$;
    this.buckets$ = this.checkoutFacade.buckets$;

    this.basket$.pipe(whenTruthy(), takeUntil(this.destroy$)).subscribe((basket: BasketView) => {
      this.basketId = basket.id;
      this.shippingMethodId = basket.commonShippingMethod.id
    });

    this.buckets$.pipe(whenTruthy(), takeUntil(this.destroy$)).subscribe((buckets: Bucket[]) => {
      this.buckets = buckets;
    });

    this.checkoutFacade.emptyBuckets$.pipe(takeUntil(this.destroy$)).subscribe(emptyBuckets => {
      this.emptyBuckets = emptyBuckets;
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
