import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { BasketValidationResultType } from 'ish-core/models/basket-validation/basket-validation.model';
import { BasketView } from 'ish-core/models/basket/basket.model';

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
  basketLoading$: Observable<boolean>;
  validationResults$: Observable<BasketValidationResultType>;

  private destroy$ = new Subject<void>();

  constructor(
    private checkoutFacade: CheckoutFacade,
    private snackBar: MatSnackBar,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.checkoutFacade.setBasketPayment('ISH_INVOICE');
    this.validationResults$ = this.checkoutFacade.basketValidationResults$;

    this.validationResults$
      .pipe(takeUntil(this.destroy$))
      .subscribe((validationResults: BasketValidationResultType) => {
        if (!validationResults.valid) {
          this.snackBar.open(
            this.translate.instant('camfil.checkout.message.cannot_process'),
            this.translate.instant('camfil.checkout.message.understood')
          );
        } else if (validationResults.valid === true) {
          this.snackBar.open(this.translate.instant('camfil.checkout.message.order_created'), undefined, {
            duration: 3000,
          });
        }
      });
  }

  submitOrder() {
    this.update.emit();

    this.checkoutFacade.continue(5);
  }
}
