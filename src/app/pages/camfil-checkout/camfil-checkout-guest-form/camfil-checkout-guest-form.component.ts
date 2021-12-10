import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { isEqual } from 'lodash-es';
import { BehaviorSubject, Observable, Subject, combineLatest } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith, takeUntil, tap } from 'rxjs/operators';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { BasketExtensionGuestData } from 'ish-core/models/basket-extension/basket-extension.interface';
import { BasketExtensionGuestForm } from 'ish-core/models/basket-extension/basket-extension.model';
import { BasketMapper } from 'ish-core/models/basket/basket.mapper';
import { Basket } from 'ish-core/models/basket/basket.model';
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
  showInvoiceAddressForm$ = new BehaviorSubject(false);
  isSubmitted$: Observable<boolean>;

  @Input() basket: Basket;
  @Input() markRequiredLabel = true;

  @Output() submit = new EventEmitter<BasketExtensionGuestData>();

  private destroy$ = new Subject();

  constructor(private fb: FormBuilder, private checkoutFacade: CheckoutFacade) {}

  ngOnInit() {
    this.isSubmitted$ = this.checkoutFacade.submittedAnonymousBasketExtension$.pipe(
      startWith(false),
      map(basketExtension => !!basketExtension)
    );

    this.basketGuestForm$ = combineLatest([
      this.isSubmitted$,
      this.checkoutFacade.submittedAnonymousBasketExtension$,
      this.checkoutFacade.anonymousBasketExtension$,
    ]).pipe(
      map(([isSubmitted, submittedBasketExtension, anonymousBasketExtension]) =>
        isSubmitted ? submittedBasketExtension : anonymousBasketExtension
      ),
      whenTruthy(),
      tap(() => {
        this.initGuestForm();
      })
    );

    this.basketGuestForm$
      .pipe(whenTruthy(), distinctUntilChanged(isEqual), takeUntil(this.destroy$))
      .subscribe(guestBasket => {
        this.patchGuestForm(guestBasket);
      });
  }

  toggleInvoiceAddressForm(value: boolean) {
    this.showInvoiceAddressForm$.next(!value);

    if (!value) {
      this.guestForm.get('invoiceAddressFormGroup').enable();
    } else {
      this.guestForm.get('invoiceAddressFormGroup').disable();
    }
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

    const anonymousBasketDataFromFormValues = BasketMapper.convertFormDataToAnonymousBasketData(this.guestForm.value);

    this.submit.emit(anonymousBasketDataFromFormValues);
  }

  private initUserDetailsForm() {
    return this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, SpecialValidators.email]],
      phone: ['', [Validators.required, Validators.pattern('[0-9+-/]*')]],
      jobTitle: [''],
      companyName: ['', [Validators.required]],
      vat: [''],
      siret: ['', [Validators.required, Validators.pattern('[0-9]{14}')]],
    });
  }

  private initDeliveryInfoForm() {
    return this.fb.group({
      streetAddress: ['', [Validators.required]],
      zipCode: ['', [Validators.required, Validators.pattern('[0-9]{5}')]],
      citySelect: [''],
      city: [{ value: '', disabled: true }, [Validators.required]],
      country: ['', [Validators.required]],
      sameAddressAsInvoice: [true],
      boxLabel: [''],
      invoiceMark: [''],
      deliveryInfo: [''],
      customerNote: [''],
    });
  }

  private initInvoiceAddressForm() {
    return this.fb.group({
      streetAddress: ['', [Validators.required]],
      zipCode: ['', [Validators.required, Validators.pattern('[0-9]{5}')]],
      citySelect: [''],
      city: [{ value: '', disabled: true }, [Validators.required]],
      country: ['', [Validators.required]],
    });
  }

  private initGuestForm() {
    if (this.guestForm) {
      return;
    }

    this.guestForm = this.fb.group({
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
