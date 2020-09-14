import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';

@Component({
  selector: 'camfil-mini-basket',
  templateUrl: './camfil-mini-basket.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./camfil-mini-basket.scss'],
})
export class CamfilMiniBasketComponent implements OnInit, OnDestroy {
  itemCount$: Observable<number>;

  private destroy$ = new Subject();

  constructor(private checkoutFacade: CheckoutFacade) {}

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit() {
    this.itemCount$ = this.checkoutFacade.basketItemCount$;
  }
}
