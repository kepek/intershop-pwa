import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { take, withLatestFrom } from 'rxjs/operators';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { Bucket } from 'ish-core/models/basket/bucket.model';
import { User } from 'ish-core/models/user/user.model';
import { ConfigurationService } from 'src/app/extensions/cam-configuration/services/configuration/configuration.service';

@Component({
  selector: 'camfil-mini-basket',
  templateUrl: './camfil-mini-basket.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./camfil-mini-basket.scss'],
})
export class CamfilMiniBasketComponent implements OnInit {
  user$: Observable<User>;
  buckets$: Observable<any[]>;
  buckets: Bucket[];
  total = 0;

  constructor(
    private checkoutFacade: CheckoutFacade,
    private accountFacade: AccountFacade,
    private router: Router,
    private configuration: ConfigurationService
  ) {}

  ngOnInit() {
    this.user$ = this.accountFacade.user$;
    this.buckets$ = this.checkoutFacade.buckets$;
  }

  totalProductQuantity(buckets: Bucket[]) {
    return buckets?.reduce((a, b) => a + b.lineItems?.reduce((c, d) => c + d.quantity.value, 0), 0);
  }

  goToBasket() {
    this.user$
      .pipe(take(1), withLatestFrom(this.configuration.isEnabled('allowAnonymusUserToNavigateToCheckoutPage')))
      .subscribe(([user, allowAnonymusUserToNavigateToCheckoutPage]) => {
        if (user || allowAnonymusUserToNavigateToCheckoutPage) {
          this.router.navigate(['/checkout']);
        } else {
          this.router.navigate(['/login']);
        }
      });
  }
}
