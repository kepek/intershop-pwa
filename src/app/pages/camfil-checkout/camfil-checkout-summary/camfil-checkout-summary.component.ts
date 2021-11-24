import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subject } from 'rxjs';
import { map, startWith, take, takeUntil, withLatestFrom } from 'rxjs/operators';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { BasketValidationResultType } from 'ish-core/models/basket-validation/basket-validation.model';
import { PriceHelper } from 'ish-core/models/price/price.helper';
import { whenFalsy } from 'ish-core/utils/operators';
import { CamfilBasketCostSummaryComponent } from 'ish-shared/components/basket/camfil-basket-cost-summary/camfil-basket-cost-summary.component';
import { CamfilSmallCtaModalComponent } from 'ish-shared/components/common/camfil-small-cta-modal/camfil-small-cta-modal.component';

@Component({
  selector: 'camfil-checkout-summary',
  templateUrl: './camfil-checkout-summary.component.html',
  styleUrls: ['./camfil-checkout-summary.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilCheckoutSummaryComponent extends CamfilBasketCostSummaryComponent {
  @Input() purchaseCurrency: string;
  @Input() isSubmitted;
  @Output() submit = new EventEmitter();

  @ViewChild(CamfilSmallCtaModalComponent) gdprErrorModal: CamfilSmallCtaModalComponent;

  bucketsVolumeDiscounts$: Observable<number>;
  validationResults$: Observable<BasketValidationResultType>;
  productsReadyToPlaceOrder$: Observable<boolean>;
  canSubmitOrder$: Observable<boolean>;
  isLoggedIn$: Observable<boolean>;

  guestGdprForm: FormGroup;
  checkIfZeroPrice = PriceHelper.checkIfZeroPrice;

  private destroy$ = new Subject();

  constructor(
    protected accountFacade: AccountFacade,
    private checkoutFacade: CheckoutFacade,
    private shoppingFacade: ShoppingFacade,
    private router: Router,
    private translate: TranslateService,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {
    super(accountFacade);
  }

  init() {
    super.init();

    this.bucketsVolumeDiscounts$ = this.checkoutFacade.bucketsVolumeDiscounts$;
    this.validationResults$ = this.checkoutFacade.basketValidationResults$;
    this.productsReadyToPlaceOrder$ = this.shoppingFacade.productsReadyToPlaceOrder$;
    this.canSubmitOrder$ = this.productsReadyToPlaceOrder$;
    this.isLoggedIn$ = this.accountFacade.isLoggedIn$;

    this.isLoggedIn$.pipe(whenFalsy(), takeUntil(this.destroy$)).subscribe(() => {
      this.initGDPRForm();
    });
  }

  submitOrder() {
    this.isLoggedIn$.pipe(take(1), takeUntil(this.destroy$)).subscribe(isLoggedIn => {
      if (isLoggedIn) {
        this.placeOrder();
      } else if (this.guestGdprForm?.valid) {
        this.placeOrder();
      } else {
        this.openGDPRErrorModal();
      }
    });
  }

  private checkErpEmployeeIdExists() {
    let erpEmployeeId;

    try {
      erpEmployeeId = JSON.parse(localStorage.getItem('erpEmployeeId'));
    } catch (err) {
      // NOOP
    }

    if (erpEmployeeId) {
      this.checkoutFacade.updateBasketExternalOrderReference(erpEmployeeId);
    }
  }

  continueShopping() {
    this.router.navigate(['/account/camcards']);
  }

  private placeOrder() {
    this.checkErpEmployeeIdExists();
    this.checkoutFacade.continue(5);
    this.submit.emit();
  }

  private initGDPRForm(): void {
    const gdprAcceptanceDefaultValue = false;

    this.guestGdprForm = this.fb.group({
      gdprAcceptance: [gdprAcceptanceDefaultValue, [Validators.requiredTrue]],
    });

    this.canSubmitOrder$ = this.guestGdprForm.get('gdprAcceptance').valueChanges.pipe(
      startWith(gdprAcceptanceDefaultValue),
      withLatestFrom(this.productsReadyToPlaceOrder$),
      map(([gdprAcceptance, readyToOrder]) => gdprAcceptance && readyToOrder)
    );
  }

  private openGDPRErrorModal() {
    const gdprErrorDialogModal = this.dialog.open(this.gdprErrorModal?.show());
    this.gdprErrorModal.hide = () => {
      gdprErrorDialogModal.close();
    };
  }

  getVolumeDiscountPrice(value, currency) {
    return PriceHelper.getVolumeDiscountPrice(value, currency, this.translate.currentLang);
  }
}
