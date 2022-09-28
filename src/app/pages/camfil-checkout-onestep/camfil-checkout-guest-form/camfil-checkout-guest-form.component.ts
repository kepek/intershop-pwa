import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { isEqual } from 'lodash-es';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, takeUntil, tap } from 'rxjs/operators';

import { AppFacade } from 'ish-core/facades/app.facade';
import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { BasketExtensionGuestData } from 'ish-core/models/basket-extension/basket-extension.interface';
import { BasketExtensionGuestForm } from 'ish-core/models/basket-extension/basket-extension.model';
import { Basket } from 'ish-core/models/basket/basket.model';
import { Country } from 'ish-core/models/country/country.model';
import { whenTruthy } from 'ish-core/utils/operators';
import { markAsDirtyRecursive } from 'ish-shared/forms/utils/form-utils';
import { SpecialValidators } from 'ish-shared/forms/validators/special-validators';

import { GUEST_FORM_VALIDATORS } from './validators';

@Component({
  selector: 'camfil-checkout-guest-form',
  templateUrl: './camfil-checkout-guest-form.component.html',
  styleUrls: ['./camfil-checkout-guest-form.component.scss'],
})
export class CamfilCheckoutGuestFormComponent implements OnInit, OnDestroy {
  userDetailsFormGroup: FormGroup;
  deliveryInfoFromGroup: FormGroup;
  guestForm: FormGroup;
  guestFormSubmitted = false;
  hideRequiredMarker = false;
  validators = GUEST_FORM_VALIDATORS;

  basketGuestForm$: Observable<BasketExtensionGuestForm>;
  countries$: Observable<Country[]>;
  showInvoiceAddressForm$ = new BehaviorSubject(false);

  @Input() basket: Basket;
  @Input() markRequiredLabel = true;

  @Output() submit = new EventEmitter<BasketExtensionGuestData>();

  private destroy$ = new Subject();

  constructor(
    private fb: FormBuilder,
    public checkoutFacade: CheckoutFacade,
    private shoppingFacade: ShoppingFacade,
    private appFacade: AppFacade
  ) {}

  ngOnInit() {
    this.countries$ = this.appFacade.countries$();

    this.basketGuestForm$ = this.checkoutFacade.anonymousBasketExtension$.pipe(
      whenTruthy(),
      tap(() => {
        this.initGuestForm();
        this.shoppingFacade.loadBasketAddresses();
      })
    );

    this.basketGuestForm$
      .pipe(whenTruthy(), distinctUntilChanged(isEqual), takeUntil(this.destroy$))
      .subscribe(guestBasket => {
        this.patchGuestForm(guestBasket);
      });

    this.shoppingFacade.basketAddresses$
      .pipe(
        map(address => address?.[0]),
        whenTruthy(),
        takeUntil(this.destroy$)
      )
      .subscribe(address => {
        const { id, countryCode } = address;

        const addressId = id;
        const deliveryInfoFromGroup = { countryCode };
        const invoiceAddressFormGroup = { countryCode };

        this.guestForm.patchValue(
          {
            addressId,
            deliveryInfoFromGroup,
            invoiceAddressFormGroup,
          },
          { emitEvent: false }
        );
      });
  }

  toggleInvoiceAddressForm(value: boolean) {
    this.showInvoiceAddressForm$.next(!value);

    if (!value) {
      this.guestForm.get('invoiceAddressFormGroup').enable();
    } else {
      this.guestForm.get('invoiceAddressFormGroup').disable();
    }
    this.getField('invoiceAddressFormGroup', 'city').disable();
  }

  validateGuestForm() {
    if (!this.guestFormSubmitted) {
      this.guestForm.markAllAsTouched();
      markAsDirtyRecursive(this.guestForm);
    }
  }

  submitGuestForm() {
    if (this.guestForm.invalid) {
      this.guestFormSubmitted = true;
      markAsDirtyRecursive(this.guestForm);
      return;
    }

    this.submit.emit(this.guestForm.value);
  }

  private initUserDetailsForm() {
    return this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, SpecialValidators.email]],
      phoneHome: ['', [Validators.required, Validators.pattern('[0-9+-/]*')]],
      jobTitle: [''],
      companyName1: ['', [Validators.required]],
      vat: [''],
      siret: ['', [Validators.required, Validators.pattern('[0-9]{14}')]],
    });
  }

  private initDeliveryInfoForm() {
    return this.fb.group({
      addressLine1: ['', [Validators.required]],
      postalCode: ['', [Validators.required, Validators.pattern('[0-9]{5}')]],
      city: ['', [Validators.required]],
      citySelect: ['', Validators.required],
      countryCode: ['', [Validators.required]],
      sameAddressAsInvoice: [true],
      boxLabel: [''],
      invoiceMark: [''],
      deliveryInfo: [''],
      customerNote: [''],
    });
  }

  private initInvoiceAddressForm() {
    return this.fb.group({
      addressLine1: ['', [Validators.required]],
      postalCode: ['', [Validators.required, Validators.pattern('[0-9]{5}')]],
      city: ['', [Validators.required]],
      citySelect: ['', Validators.required],
      countryCode: ['', [Validators.required]],
    });
  }

  private initGuestForm() {
    if (this.guestForm) {
      return;
    }

    this.guestForm = this.fb.group({
      addressId: ['', [Validators.required]],
      userDetailsFormGroup: this.initUserDetailsForm(),
      deliveryInfoFromGroup: this.initDeliveryInfoForm(),
      invoiceAddressFormGroup: this.initInvoiceAddressForm(),
    });

    this.guestForm.valueChanges
      .pipe(debounceTime(800), whenTruthy(), distinctUntilChanged(isEqual), takeUntil(this.destroy$))
      .subscribe(() => {
        this.submitGuestForm();
      });

    this.guestForm
      ?.get('deliveryInfoFromGroup')
      ?.get('sameAddressAsInvoice')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value: boolean) => {
        this.toggleInvoiceAddressForm(!!value);
      });
  }

  // tslint:disable-next-line:no-any
  private patchGuestForm(guestFormValues: any) {
    const { userDetailsFormGroup, deliveryInfoFromGroup, invoiceAddressFormGroup } = guestFormValues;

    this.showInvoiceAddressForm$.next(!deliveryInfoFromGroup.sameAddressAsInvoice);

    this.guestForm.patchValue(
      {
        userDetailsFormGroup,
        deliveryInfoFromGroup,
        invoiceAddressFormGroup,
      },
      { emitEvent: false }
    );
  }

  getField(formName: string, fieldName: string) {
    return this.guestForm?.get([formName, fieldName]);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
