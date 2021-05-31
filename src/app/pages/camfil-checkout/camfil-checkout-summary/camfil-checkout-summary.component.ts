import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subject } from 'rxjs';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { BasketView } from 'ish-core/models/basket/basket.model';
import { PriceHelper } from 'ish-core/models/price/price.helper';

@Component({
  selector: 'camfil-checkout-summary',
  templateUrl: './camfil-checkout-summary.component.html',
  styleUrls: ['./camfil-checkout-summary.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilCheckoutSummaryComponent implements OnInit {
  @Input() basket: BasketView;
  @Input() isConfirmed;
  @Output() update = new EventEmitter();

  productsReadyToPlaceOrder$: Observable<boolean>;
  bucketsVolumeDiscounts$: Observable<number>;
  basketVolumeDiscount;

  constructor(
    private checkoutFacade: CheckoutFacade,
    private shoppingFacade: ShoppingFacade,
    private router: Router,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.productsReadyToPlaceOrder$ = this.shoppingFacade.productsReadyToPlaceOrder$;
    this.bucketsVolumeDiscounts$ = this.checkoutFacade.bucketsVolumeDiscounts$;
  }

  submitOrder() {
    this.update.emit();

    // In case of user from ICM back office, add employeeID as externalOrderReference
    const erpEmployeeId = localStorage.getItem('erpEmployeeId');
    if (erpEmployeeId) {
      this.checkoutFacade.updateBasketExternalOrderReference(erpEmployeeId);
    }

    this.checkoutFacade.continue(5);
  }

  continueShopping() {
    this.router.navigate(['/account/camcards']);
  }

  getVolumeDiscountPrice(value, currency) {
    return PriceHelper.getVolumeDiscountPrice(value, currency, this.translate.currentLang);
  }
}
