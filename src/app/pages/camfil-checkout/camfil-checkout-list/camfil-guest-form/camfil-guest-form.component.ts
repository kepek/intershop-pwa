import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BasketExtensions } from 'ish-core/models/basket/basket.interface';
import { SpecialValidators } from 'ish-shared/forms/validators/special-validators';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'camfil-camfil-guest-form',
  templateUrl: './camfil-guest-form.component.html',
  styleUrls: ['./camfil-guest-form.component.scss'],
})
export class CamfilGuestFormComponent implements OnInit, OnDestroy {
  userDetailsFormGroup: FormGroup;
  deliveryInfoFromGroup: FormGroup;
  guestForm: FormGroup;
  showInvoiceAddressForm = false;
  @Output() submit = new EventEmitter<BasketExtensions>();

  private destroy$ = new Subject();

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.guestForm = this.fb.group({
      userDetailsFormGroup: this.initUserDetailsForm(),
      deliveryInfoFromGroup: this.initDeliveryInfoForm(),
    });

    if (this.guestForm) {
      this.guestForm.valueChanges.pipe(debounceTime(500), takeUntil(this.destroy$)).subscribe(() => {
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
      siret: [''],
    });
  }

  initDeliveryInfoForm() {
    return this.fb.group({
      streetAddress: ['', [Validators.required]],
      zipCode: ['', [Validators.required]],
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
      zipCode: ['', [Validators.required]],
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
    const sameAsDelivery = this.guestForm.get(['deliveryInfoFromGroup', 'sameAddressAsInvoice']).value;
    const deliveryAddress = {
      id: 'deliveryAddressId',
      urn: 'deliveryAddressURN',
      addressName: 'deliveryAddress',
      firstName: this.guestForm.get(['userDetailsFormGroup', 'firstName']).value,
      lastName: this.guestForm.get(['userDetailsFormGroup', 'lastName']).value,
      email: this.guestForm.get(['userDetailsFormGroup', 'email']).value,
      phoneHome: this.guestForm.get(['userDetailsFormGroup', 'phone']).value,
      companyName1: this.guestForm.get(['userDetailsFormGroup', 'companyName']).value,
      addressLine1: this.guestForm.get(['invoiceAddressFormGroup', 'streetAddress']).value,
      postalCode: this.guestForm.get(['invoiceAddressFormGroup', 'zipCode']).value,
      city: this.guestForm.get(['invoiceAddressFormGroup', 'city']).value,
      country: this.guestForm.get(['invoiceAddressFormGroup', 'country']).value,
      invoiceToAddress: false,
      countryCode: 'FR',
      shipToAddress: true,
    };

    const invoiceAddress = sameAsDelivery
      ? deliveryAddress
      : {
          id: 'invoiceAddressId',
          urn: 'invoiceAddressURN',
          addressName: 'invoiceAddress',
          firstName: this.guestForm.get(['userDetailsFormGroup', 'firstName']).value,
          lastName: this.guestForm.get(['userDetailsFormGroup', 'lastName']).value,
          email: this.guestForm.get(['userDetailsFormGroup', 'email']).value,
          phoneHome: this.guestForm.get(['userDetailsFormGroup', 'phone']).value,
          addressLine1: this.guestForm.get(['deliveryInfoFromGroup', 'streetAddress']).value,
          postalCode: this.guestForm.get(['deliveryInfoFromGroup', 'zipCode']).value,
          city: this.guestForm.get(['deliveryInfoFromGroup', 'city']).value,
          country: this.guestForm.get(['deliveryInfoFromGroup', 'country']).value,
          invoiceToAddress: true,
          countryCode: 'FR',
          shipToAddress: false,
        };
    this.submit.emit({
      deliveryAddress: deliveryAddress,
      invoiceAddress: invoiceAddress,
      vat: this.guestForm.get(['userDetailsFormGroup', 'vat']).value,
      jobTitle: this.guestForm.get(['userDetailsFormGroup', 'jobTitle']).value,
      siret: this.guestForm.get(['userDetailsFormGroup', 'siret']).value,
      orderMark: this.guestForm.get(['deliveryInfoFromGroup', 'boxLabel']).value,
      invoiceLabel: this.guestForm.get(['deliveryInfoFromGroup', 'invoiceMark']).value,
      info: this.guestForm.get(['deliveryInfoFromGroup', 'deliveryInfo']).value,
      customerNote: this.guestForm.get(['deliveryInfoFromGroup', 'customerNote']).value,
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
