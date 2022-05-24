import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CamfilConfigurationFacade } from 'camfil-pwa/facades/camfil-configuration.facade';
import { Observable, Subject, combineLatest } from 'rxjs';
import { map, startWith, take, takeUntil, withLatestFrom } from 'rxjs/operators';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { BasketSurchargeHelper } from 'ish-core/models/basket-surcharge/basket-surcharge.helper';
import { BasketSurcharge } from 'ish-core/models/basket-surcharge/basket-surcharge.model';
import { BasketValidationResultType } from 'ish-core/models/basket-validation/basket-validation.model';
import { PriceHelper } from 'ish-core/models/price/price.helper';
import { Price } from 'ish-core/models/price/price.model';
import { whenFalsy } from 'ish-core/utils/operators';
import { RoleToggleService } from 'ish-core/utils/role-toggle/role-toggle.service';
import { CamfilBasketCostSummaryComponent } from 'ish-shared/components/basket/camfil-basket-cost-summary/camfil-basket-cost-summary.component';
import {
  CamfilModalDialogComponent,
  ModalOptions,
} from 'ish-shared/components/common/camfil-modal-dialog/camfil-modal-dialog.component';
import { CamfilSmallCtaModalComponent } from 'ish-shared/components/common/camfil-small-cta-modal/camfil-small-cta-modal.component';

@Component({
  selector: 'camfil-checkout-summary',
  templateUrl: './camfil-checkout-summary.component.html',
  styleUrls: ['./camfil-checkout-summary.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilCheckoutSummaryComponent extends CamfilBasketCostSummaryComponent {
  @Input() purchaseCurrency: string;
  @Input() editable: boolean;
  @Output() submit = new EventEmitter<string>();

  @ViewChild(CamfilSmallCtaModalComponent) gdprErrorModal: CamfilSmallCtaModalComponent;

  bucketsVolumeDiscounts$: Observable<Price>;
  validationResults$: Observable<BasketValidationResultType>;
  productsReadyToPlaceOrder$: Observable<boolean>;
  canSubmitOrder$: Observable<boolean>;
  isLoggedIn$: Observable<boolean>;
  canRequestQuotations$: Observable<boolean>;

  guestGdprForm: FormGroup;
  bucketSurchargeTotalsByType?: BasketSurcharge[];
  sortBucketSurchargeTotalsByType = BasketSurchargeHelper.sortBucketSurchargeTotalsByType;
  checkIfZeroPrice = PriceHelper.checkIfZeroPrice;

  private destroy$ = new Subject();

  @ViewChild('quoteCreatedModal') quoteCreatedModal: CamfilModalDialogComponent<any>;
  quoteCreatedModalOptions: ModalOptions = {
    titleText: 'The quotation request has been sent',
    confirmText: 'Go to my Quotations',
    rejectText: 'Stay at the checkout',
  };

  constructor(
    protected accountFacade: AccountFacade,
    private checkoutFacade: CheckoutFacade,
    private shoppingFacade: ShoppingFacade,
    private camfilConfigurationFacade: CamfilConfigurationFacade,
    private roleToggleService: RoleToggleService,
    private router: Router,
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

    this.canSubmitOrder$ = combineLatest([
      this.roleToggleService.hasRole('APP_B2B_NO_CHECKOUT_USER'),
      this.productsReadyToPlaceOrder$,
    ]).pipe(map(([isNoCheckoutUser, isReady]) => (isNoCheckoutUser ? false : isReady)));

    this.isLoggedIn$ = this.accountFacade.isLoggedIn$;
    this.isLoggedIn$.pipe(whenFalsy(), takeUntil(this.destroy$)).subscribe(() => {
      this.initGDPRForm();
    });

    this.canRequestQuotations$ = combineLatest([
      this.roleToggleService.hasRole('APP_B2B_REQUEST_QUOTATION'),
      this.camfilConfigurationFacade.isEnabled$('allowQuotes'),
    ]).pipe(map(([hasRequestRole, isQuotesModuleEnabled]) => hasRequestRole && isQuotesModuleEnabled));

    this.camfilConfigurationFacade
      ?.isEnabled$('displayFeesInSpecialOrderOnCheckoutSummary')
      ?.pipe(takeUntil(this.destroy$))
      .subscribe(displayFeesInSpecialOrderOnCheckoutSummary => {
        this.bucketSurchargeTotalsByType = displayFeesInSpecialOrderOnCheckoutSummary
          ? this.sortBucketSurchargeTotalsByType(this.totals.bucketSurchargeTotalsByType)
          : this.totals.bucketSurchargeTotalsByType;
      });
  }

  submitOrder() {
    this.isLoggedIn$.pipe(take(1), takeUntil(this.destroy$)).subscribe(isLoggedIn => {
      if (isLoggedIn) {
        this.submit.emit();
      } else if (this.guestGdprForm?.valid) {
        this.submit.emit();
      } else {
        this.openGDPRErrorModal();
      }
    });
  }

  requestQuote() {
    this.isLoggedIn$.pipe(take(1), takeUntil(this.destroy$)).subscribe(isLoggedIn => {
      if (isLoggedIn) {
        this.submit.emit('RFQ');
      } else if (this.guestGdprForm?.valid) {
        this.submit.emit('RGQ');
      } else {
        this.openGDPRErrorModal();
      }
    });
  }

  continueShopping() {
    this.camfilConfigurationFacade.continueShoppingUrl$.pipe(take(1)).subscribe(continueShoppingUrl => {
      this.router.navigate([continueShoppingUrl]);
    });
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

  onQuoteCreatedModalConfirmed() {
    this.router.navigate(['account', 'quotes']);
  }
}
