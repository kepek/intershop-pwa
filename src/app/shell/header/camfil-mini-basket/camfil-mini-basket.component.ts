import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { Bucket } from 'ish-core/models/basket/bucket.model';
import { User } from 'ish-core/models/user/user.model';
import { whenTruthy } from 'ish-core/utils/operators';

import { CamCardsFacade } from '../../../extensions/cam-cards/facades/cam-cards.facade';
import { CamCard } from '../../../extensions/cam-cards/models/cam-card/cam-card.model';

@Component({
  selector: 'camfil-mini-basket',
  templateUrl: './camfil-mini-basket.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./camfil-mini-basket.scss'],
})
export class CamfilMiniBasketComponent implements OnInit, OnDestroy {
  itemCount$: Observable<number>;
  user$: Observable<User>;
  private destroy$ = new Subject();
  buckets$: Observable<any[]>;
  buckets: Bucket[];
  camCards: CamCard[];
  total = 0;

  constructor(
    private checkoutFacade: CheckoutFacade,
    private accountFacade: AccountFacade,
    private camCardsFacade: CamCardsFacade,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit() {
    this.user$ = this.accountFacade.user$;
    this.itemCount$ = this.checkoutFacade.basketItemCount$;

    this.buckets$ = this.checkoutFacade.buckets$;

    this.camCardsFacade.camCard$?.pipe(whenTruthy(), takeUntil(this.destroy$)).subscribe(camCards => {
      this.camCards = camCards;
    });

    this.buckets$?.pipe(takeUntil(this.destroy$)).subscribe((buckets: Bucket[]) => {
      if (buckets && this.camCards?.length) {
        // this.buckets = this.connectWithCamCard(buckets);
        this.buckets = buckets;
        this.total = this.totalProductQuantity();
        this.cdr.detectChanges();
      } else {
        this.total = 0;
        this.cdr.detectChanges();
      }
    });
  }

  getCamCard(deliveryAddressId: string) {
    return this.camCards.find(camcard => camcard?.deliveryAddress?.id === deliveryAddressId);
  }

  totalProductQuantity() {
    return this.buckets?.reduce((a, b) => a + b.lineItems?.reduce((c, d) => c + d.quantity.value, 0), 0);
  }

  goToBasket() {
    this.user$.pipe(take(1), takeUntil(this.destroy$)).subscribe(user => {
      if (user) {
        this.router.navigate(['/checkout']);
      } else {
        this.router.navigate(['/login']);
      }
    });
  }
}
