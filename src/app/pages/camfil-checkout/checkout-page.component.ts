import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { BasketView } from 'ish-core/models/basket/basket.model';
import { Bucket } from 'ish-core/models/basket/bucket.model';
import { whenTruthy } from 'ish-core/utils/operators';

import { CamCardsFacade } from '../../extensions/cam-cards/facades/cam-cards.facade';
import { CamCard } from '../../extensions/cam-cards/models/cam-card/cam-card.model';

@Component({
  templateUrl: './checkout-page.component.html',
  styleUrls: ['./checkout-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class CheckoutPageComponent implements OnInit, OnDestroy {
  basket$: Observable<BasketView>;
  basketId: string;
  buckets$: Observable<any[]>;
  buckets: Bucket[];
  emptyBuckets: Bucket[];

  camCards: CamCard[];

  private destroy$ = new Subject<void>();

  constructor(
    private checkoutFacade: CheckoutFacade,
    private camCardsFacade: CamCardsFacade,
    private productFacade: ShoppingFacade
  ) {}

  ngOnInit() {
    this.initBasket();
  }

  initBasket() {
    this.basket$ = this.checkoutFacade.basket$;
    this.buckets$ = this.checkoutFacade.buckets$;

    this.basket$.pipe(whenTruthy(), takeUntil(this.destroy$)).subscribe((basket: BasketView) => {
      this.basketId = basket.id;
    });

    this.camCardsFacade.camCard$.pipe(whenTruthy(), takeUntil(this.destroy$)).subscribe(camCards => {
      this.camCards = camCards;
      this.checkoutFacade.loadBuckets();
    });

    this.buckets$.pipe(takeUntil(this.destroy$)).subscribe((buckets: Bucket[]) => {
      if (buckets && this.camCards.length) {
        this.buckets = this.connectWithCamCard(buckets);
      }
    });

    this.productFacade.productAdded$.pipe(whenTruthy(), takeUntil(this.destroy$)).subscribe(() => {
      this.camCardsFacade.loadCamCards();
    });

    this.checkoutFacade.emptyBuckets$.pipe(takeUntil(this.destroy$)).subscribe(emptyBuckets => {
      this.emptyBuckets = emptyBuckets;
    });
  }

  connectWithCamCard(buckets: Bucket[]): Bucket[] {
    return buckets
      .map(bucket => {
        const camCard = this.getCamCard(bucket.deliveryAddressId);

        return camCard
          ? {
              ...bucket,
              shipToAddress: camCard.deliveryAddress.urn,
              shipToAddressFull: camCard.deliveryAddress,
              orderName: camCard.name,
              nextDelivery: camCard.nextDeliveryDate,
              orderMark: camCard.orderLabel,
              customer: camCard.customer,
              contacts: camCard.contacts,
              camCardId: camCard.id,
            }
          : { ...bucket };
      })
      .filter(bucket => bucket.orderName);
  }

  getCamCard(deliveryAddressId: string) {
    return this.camCards.find(camcard => camcard.deliveryAddress.id === deliveryAddressId);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
