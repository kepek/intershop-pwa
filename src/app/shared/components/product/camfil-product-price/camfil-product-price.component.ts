import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { CamfilConfigurationFacade } from 'camfil-pwa/facades/camfil-configuration.facade';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { ProductPriceComponent } from 'ish-shared/components/product/product-price/product-price.component';

@Component({
  selector: 'camfil-product-price',
  templateUrl: './camfil-product-price.component.html',
  styleUrls: ['./camfil-product-price.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilProductPriceComponent extends ProductPriceComponent implements OnInit {
  @Input() showInformationalPrice = true;
  @Input() showPriceSavings = false;

  isLoggedIn$: Observable<boolean>;
  showPricesForNonLoggedInUser: boolean;

  constructor(private accountFacade: AccountFacade, private camfilConfigurationFacade: CamfilConfigurationFacade) {
    super();
  }

  ngOnInit() {
    this.isLoggedIn$ = this.accountFacade.isLoggedIn$;

    this.camfilConfigurationFacade
      .isEnabled$('showPricesForNonLoggedInUser')
      .pipe(take(1))
      .subscribe(val => {
        this.showPricesForNonLoggedInUser = val;
      });
  }
}
