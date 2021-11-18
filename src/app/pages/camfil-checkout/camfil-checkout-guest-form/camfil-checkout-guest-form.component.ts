import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { isEqual } from 'lodash-es';
import { Observable, Subject, combineLatest } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, takeUntil, tap } from 'rxjs/operators';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { GuestBasketData } from 'ish-core/models/basket/basket.interface';
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
  showInvoiceAddressForm = false;
  submitted = false;
  hideRequiredMarker = false;
  validators = GUEST_FORM_VALIDATORS;

  anonymousBasketExtension$: Observable<GuestBasketData>;
  countryChangeDetect$: Subject<boolean> = new Subject();

  @Input() basket: Basket;
  @Input() isSubmitted: boolean;
  @Input() markRequiredLabel = true;

  @Output() submit = new EventEmitter<GuestBasketData>();

  private destroy$ = new Subject();

  constructor(private fb: FormBuilder, private checkoutFacade: CheckoutFacade) {}

  ngOnInit() {
    this.anonymousBasketExtension$ = combineLatest([
      this.checkoutFacade.submittedAnonymousBasketExtension$,
      this.checkoutFacade.anonymousBasketExtension$,
    ]).pipe(
      map(([submittedBasketExtension, anonymousBasektExtension]) =>
        this.isSubmitted ? submittedBasketExtension : anonymousBasektExtension
      ),
      whenTruthy(),
      tap(() => {
        this.initGuestForm();
      })
    );

    this.anonymousBasketExtension$
      .pipe(whenTruthy(), distinctUntilChanged(isEqual), takeUntil(this.destroy$))
      .subscribe(value => {
        this.patchGuestForm(BasketMapper.getAnonymousBasket(value));
      });
  }

  toggleInvoiceAddressForm(value: boolean) {
    this.showInvoiceAddressForm = !value;

    if (this.showInvoiceAddressForm) {
      this.guestForm.get('invoiceAddressFormGroup').enable();
    } else {
      this.guestForm.get('invoiceAddressFormGroup').disable();
    }
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
      .pipe(
        debounceTime(400),
        whenTruthy(),
        distinctUntilChanged(isEqual),
        tap(x => console.log('x', x)),
        takeUntil(this.destroy$)
      )
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

  private initUserDetailsForm() {
    return this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, SpecialValidators.email]],
      phone: ['', [Validators.required]],
      jobTitle: [''],
      companyName: [''],
      vat: [''],
      siret: ['', [Validators.required, Validators.pattern('[0-9]{14}')]],
    });
  }

  private initDeliveryInfoForm() {
    return this.fb.group({
      streetAddress: ['', [Validators.required]],
      zipCode: ['', [Validators.required, Validators.pattern('[0-9]{5}')]],
      city: ['', [Validators.required]],
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
      city: ['', [Validators.required]],
      country: ['', [Validators.required]],
    });
  }

  submitGuestForm() {
    if (this.guestForm.invalid) {
      this.submitted = true;
      markAsDirtyRecursive(this.guestForm);
      return;
    }

    const anonymousBasketDataFromFormValues = BasketMapper.convertFormDataToAnonymousBasketData(this.guestForm.value);

    this.submit.emit(anonymousBasketDataFromFormValues);
  }

  // tslint:disable-next-line:no-any
  private patchGuestForm(guestFormValues: any) {
    const { userDetailsFormGroup, deliveryInfoFromGroup, invoiceAddressFormGroup } = guestFormValues;

    delete deliveryInfoFromGroup.sameAddressAsInvoice;

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

  checkZipCode() {
    this.countryChangeDetect$.next(true);
  }

  setZipCodeError(event, formGroup) {
    /* tslint:disable:no-string-literal */
    this.guestForm.controls[formGroup]['controls'].zipCode.setErrors(event);
    this.guestForm.controls[formGroup].updateValueAndValidity();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
