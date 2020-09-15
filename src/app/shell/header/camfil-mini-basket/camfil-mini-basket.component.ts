import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { User } from 'ish-core/models/user/user.model';

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

  constructor(private checkoutFacade: CheckoutFacade, private accountFacade: AccountFacade, private router: Router) {}

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit() {
    this.user$ = this.accountFacade.user$;
    this.itemCount$ = this.checkoutFacade.basketItemCount$;
  }

  goToBasket() {
    this.user$.pipe(take(1), takeUntil(this.destroy$)).subscribe(user => {
      if (user) {
        this.router.navigate(['/basket']);
      } else {
        this.router.navigate(['/login']);
      }
    });
  }
}
