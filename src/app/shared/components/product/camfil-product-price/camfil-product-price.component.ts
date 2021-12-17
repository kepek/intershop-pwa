import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { CamConfigurationFacade } from 'src/app/extensions/cam-configuration/facades/cam-configuration.facade';

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

  constructor(private accountFacade: AccountFacade, private camConfFacade: CamConfigurationFacade) {
    super();
  }

  ngOnInit() {
    this.isLoggedIn$ = this.accountFacade.isLoggedIn$;

    this.camConfFacade.showPricesForNonLoggedInUser$.pipe(take(1)).subscribe(val => {
      this.showPricesForNonLoggedInUser = val;
    });
  }
}
