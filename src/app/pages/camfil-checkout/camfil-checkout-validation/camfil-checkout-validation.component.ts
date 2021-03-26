import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { BasketValidationResultType } from 'ish-core/models/basket-validation/basket-validation.model';

@Component({
  selector: 'camfil-checkout-validation',
  templateUrl: './camfil-checkout-validation.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilCheckoutValidationComponent implements OnInit, OnDestroy {
  validationResults$: Observable<BasketValidationResultType>;
  buckets$: Observable<any[]>;

  private destroy$ = new Subject<void>();

  constructor(private checkoutFacade: CheckoutFacade) {}

  ngOnInit() {
    this.validationResults$ = this.checkoutFacade.basketValidationResults$;
    this.buckets$ = this.checkoutFacade.buckets$;
  }

  calculateBucketPosition(id, buckets) {
    const flattenBuckets = buckets.map(bucket => bucket.deliveryAddressId);

    return flattenBuckets.indexOf(id) + 1;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
