import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subject, combineLatest } from 'rxjs';
import { debounceTime, map, takeUntil } from 'rxjs/operators';
import { CamConfigurationFacade } from 'src/app/extensions/cam-configuration/facades/cam-configuration.facade';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { GuestBasketExtensions } from 'ish-core/models/basket/basket.interface';
import { BasketMapper } from 'ish-core/models/basket/basket.mapper';
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
  countryCode: string;
  anonymousBasketExtensionData;
  submitted = false;
  validators = GUEST_FORM_VALIDATORS;
  anonymousBasektExtension$: Observable<GuestBasketExtensions>;
  @Input() isConfirmed: boolean;
  @Output() submit = new EventEmitter<GuestBasketExtensions>();

  countryChangeDetect$: Subject<boolean> = new Subject();

  private destroy$ = new Subject();

  constructor(
    private fb: FormBuilder,
    private camConfigurationFacade: CamConfigurationFacade,
    private checkoutFacade: CheckoutFacade
  ) {}

  ngOnInit() {
    this.camConfigurationFacade.countryCode$?.pipe(takeUntil(this.destroy$)).subscribe(value => {
      this.countryCode = value;
    });

    this.anonymousBasektExtension$ = combineLatest([
      this.checkoutFacade.submittedAnonymousBaskeExtension$,
      this.checkoutFacade.anonymousBaskeExtension$,
    ]).pipe(
      map(([submittedBasketExtension, anonymousBasektExtension]) =>
        this.isConfirmed ? submittedBasketExtension : anonymousBasektExtension
      )
    );

    this.anonymousBasektExtension$.subscribe(value => {
      this.anonymousBasketExtensionData = BasketMapper.getAnonymousBasket(value);
    });

    this.guestForm = this.fb.group({
      userDetailsFormGroup: this.initUserDetailsForm(),
      deliveryInfoFromGroup: this.initDeliveryInfoForm(),
    });

    if (this.guestForm) {
      this.patchGuestForm();
      this.guestForm?.valueChanges.pipe(debounceTime(500), takeUntil(this.destroy$)).subscribe(() => {
        this.submitGuestForm();
      });
    }
  }

  initUserDetailsForm() {
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

  initDeliveryInfoForm() {
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

  initInvoiceAddressForm() {
    return this.fb.group({
      streetAddress: ['', [Validators.required]],
      zipCode: ['', [Validators.required, Validators.pattern('[0-9]{5}')]],
      city: ['', [Validators.required]],
      country: ['', [Validators.required]],
    });
  }

  toggleInvoiceAddressForm() {
    const isChecked = this.guestForm.get(['deliveryInfoFromGroup', 'sameAddressAsInvoice']).value;

    this.showInvoiceAddressForm = !isChecked;
    if (this.showInvoiceAddressForm && !this.guestForm.contains('invoiceAddressFormGroup')) {
      this.guestForm.addControl('invoiceAddressFormGroup', this.initDeliveryInfoForm());
    } else {
      this.guestForm.removeControl('invoiceAddressFormGroup');
    }
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

  patchGuestForm() {
    if (this.anonymousBasketExtensionData) {
      const {
        userDetailsFormGroup,
        deliveryInfoFromGroup,
        invoiceAddressFormGroup,
      } = this.anonymousBasketExtensionData;

      this.guestForm.controls.userDetailsFormGroup.patchValue({
        ...userDetailsFormGroup,
      });

      this.guestForm.controls.deliveryInfoFromGroup.patchValue({
        ...deliveryInfoFromGroup,
      });

      if (!deliveryInfoFromGroup.sameAddressAsInvoice) {
        this.toggleInvoiceAddressForm();
        this.guestForm.controls.invoiceAddressFormGroup.patchValue({
          ...invoiceAddressFormGroup,
        });
      }
    }
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
