// tslint:disable: ish-ordered-imports project-structure
import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { getOrder, loadOrder } from 'ish-core/store/customer/orders';
import { select, Store } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { Address } from 'ish-core/models/address/address.model';
import { camfilUpdateBasketAddress } from 'camfil-pwa/store/ish-customer/ish-basket/ish-basket.actions';
import { combineLatest } from 'rxjs';
import { CamfilConfigurationFacade } from './camfil-configuration.facade';
import { getAllBuckets, getCurrentBasket, getCurrentBuckets } from 'ish-core/store/customer/basket';
import { map } from 'rxjs/operators';
import { BasketSurchargeHelper } from 'ish-core/models/basket-surcharge/basket-surcharge.helper';

@Injectable({ providedIn: 'root' })
export class IshCheckoutFacade extends CheckoutFacade {
  constructor(protected store: Store, private camfilConfigurrationFacade: CamfilConfigurationFacade) {
    super(store);
  }
  basket$ = combineLatest([
    this.store.pipe(select(getCurrentBasket)),
    this.camfilConfigurrationFacade.basketSurchargeOrder$,
  ]).pipe(
    map(([basket, basketSurchargeOrder]) => ({
      ...basket,
      totals: {
        ...basket?.totals,
        bucketSurchargeTotalsByType: BasketSurchargeHelper.sortSurchargeTotalsByType(
          basket?.totals?.bucketSurchargeTotalsByType,
          basketSurchargeOrder
        ),
      },
    }))
  );

  buckets$ = combineLatest([
    this.store.pipe(select(getCurrentBuckets)),
    this.camfilConfigurrationFacade.bucketSurchargeOrder$,
  ]).pipe(
    map(([buckets, bucketSurchargeOrder]) =>
      buckets?.map(bucket => ({
        ...bucket,
        totals: {
          ...bucket.totals,
          surcharges: BasketSurchargeHelper.sortSurchargeTotalsByType(bucket?.totals?.surcharges, bucketSurchargeOrder),
        },
      }))
    )
  );

  allBuckets$ = combineLatest([
    this.store.pipe(select(getAllBuckets)),
    this.camfilConfigurrationFacade.bucketSurchargeOrder$,
  ]).pipe(
    map(([buckets, bucketSurchargeOrder]) =>
      buckets?.map(bucket => ({
        ...bucket,
        totals: {
          ...bucket.totals,
          surcharges: BasketSurchargeHelper.sortSurchargeTotalsByType(bucket?.totals?.surcharges, bucketSurchargeOrder),
        },
      }))
    )
  );

  loadOrder$(orderId: string) {
    this.store.dispatch(loadOrder({ orderId }));
    return this.store.pipe(select(getOrder, { orderId }));
  }

  camfilUpdateBasketAddress(address: Address, isBasket?: boolean) {
    this.store.dispatch(camfilUpdateBasketAddress({ address, isBasket }));
  }
}
