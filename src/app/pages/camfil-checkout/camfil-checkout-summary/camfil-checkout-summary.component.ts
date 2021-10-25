import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { ConfigurationService } from 'src/app/extensions/cam-configuration/services/configuration/configuration.service';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { BasketValidationResultType } from 'ish-core/models/basket-validation/basket-validation.model';
import { BasketView } from 'ish-core/models/basket/basket.model';
import { PriceHelper } from 'ish-core/models/price/price.helper';
import { CamfilSmallCtaModalComponent } from 'ish-shared/components/common/camfil-small-cta-modal/camfil-small-cta-modal.component';

@Component({
  selector: 'camfil-checkout-summary',
  templateUrl: './camfil-checkout-summary.component.html',
  styleUrls: ['./camfil-checkout-summary.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilCheckoutSummaryComponent implements OnInit, OnChanges {
  @Input() basket: BasketView;
  @Input() isConfirmed;
  @Output() update = new EventEmitter();

  productsReadyToPlaceOrder$: Observable<boolean>;
  bucketsVolumeDiscounts$: Observable<number>;
  validationResults$: Observable<BasketValidationResultType>;
  guestGdprForm: FormGroup;

  @ViewChild(CamfilSmallCtaModalComponent) gdprErrorModal: CamfilSmallCtaModalComponent;

  private isTracked = false;

  constructor(
    private checkoutFacade: CheckoutFacade,
    private shoppingFacade: ShoppingFacade,
    private router: Router,
    private translate: TranslateService,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private configurationService: ConfigurationService
  ) {}

  ngOnInit() {
    this.bucketsVolumeDiscounts$ = this.checkoutFacade.bucketsVolumeDiscounts$;
    this.validationResults$ = this.checkoutFacade.basketValidationResults$;
    this.productsReadyToPlaceOrder$ = this.shoppingFacade.productsReadyToPlaceOrder$;

    if (this.configurationService.isEnabled('guestCheckout')) {
      return;
    }

    this.createGuestGdprForm();
  }

  ngOnChanges() {
    if (this.isConfirmed && !this.isTracked) {
      this.checkoutFacade.trackPurchase(this.basket);
      this.isTracked = true;
    }
  }

  submitOrder() {
    if (this.guestGdprForm && this.guestGdprForm.invalid) {
      this.openGpdrErrorModal();

      return;
    }
    this.update.emit();

    // In case of user from ICM back office, add employeeID as externalOrderReference
    let erpEmployeeId;

    try {
      erpEmployeeId = JSON.parse(localStorage.getItem('erpEmployeeId'));
    } catch (err) {
      // NOOP
    }

    if (erpEmployeeId) {
      this.checkoutFacade.updateBasketExternalOrderReference(erpEmployeeId);
    }

    this.checkoutFacade.continue(5);
  }

  private createGuestGdprForm(): void {
    this.guestGdprForm = this.fb.group({
      gdprAcceptance: ['', [Validators.requiredTrue]],
    });
  }

  private openGpdrErrorModal() {
    const gpdrErrorDialogModal = this.dialog.open(this.gdprErrorModal?.show());
    this.gdprErrorModal.hide = () => {
      gpdrErrorDialogModal.close();
    };
  }

  continueShopping() {
    this.router.navigate(['/account/camcards']);
  }

  getVolumeDiscountPrice(value, currency) {
    return PriceHelper.getVolumeDiscountPrice(value, currency, this.translate.currentLang);
  }
}
