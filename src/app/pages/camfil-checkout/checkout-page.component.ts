import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { BasketValidationResultType } from 'ish-core/models/basket-validation/basket-validation.model';
import { BasketView } from 'ish-core/models/basket/basket.model';
import { Bucket } from 'ish-core/models/basket/bucket.model';
import { whenTruthy } from 'ish-core/utils/operators';

import { CamCard } from '../../extensions/cam-cards/models/cam-card/cam-card.model';

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
  basket: BasketView;
  emptyBuckets: Bucket[];
  basketLoading$: Observable<boolean>;
  validationResults$: Observable<BasketValidationResultType>;
  validation = false;

  private destroy$ = new Subject<void>();

  camCards: CamCard[];

  isConfirmed = false;

  unavailableProducts = {};

  constructor(
    private checkoutFacade: CheckoutFacade,
    private shoppingFacade: ShoppingFacade,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.initBasket();
    this.shoppingFacade.loadBasketAddresses();
  }

  initBasket() {
    this.basket$ = this.checkoutFacade.basket$;
    this.buckets$ = this.checkoutFacade.buckets$;
    this.basketLoading$ = this.checkoutFacade.basketLoading$;
    this.validationResults$ = this.checkoutFacade.basketValidationResults$;

    this.basket$.pipe(whenTruthy(), takeUntil(this.destroy$)).subscribe((basket: BasketView) => {
      this.basketId = basket.id;
      this.basket = basket;
      this.shippingMethodId = basket.commonShippingMethod?.id;
    });

    this.buckets$.pipe(whenTruthy(), takeUntil(this.destroy$)).subscribe((buckets: Bucket[]) => {
      this.buckets = buckets;
      this.cdr.detectChanges();
    });

    this.validationResults$
      .pipe(whenTruthy(), takeUntil(this.destroy$))
      .subscribe((validationResults: BasketValidationResultType) => {
        if (validationResults.valid) {
          this.validation = validationResults.valid;
          this.cdr.detectChanges();
        }
      });

    this.checkoutFacade.emptyBuckets$.pipe(takeUntil(this.destroy$)).subscribe(emptyBuckets => {
      this.emptyBuckets = emptyBuckets;
    });
  }

  handleProductLoad(product) {
    if (!product?.availability) {
      this.unavailableProducts[product.sku] = product;
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
