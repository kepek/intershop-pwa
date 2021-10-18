import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GuestBucketAddress } from 'ish-core/models/basket/bucket.model';

@Component({
  selector: 'camfil-camfil-guest-form',
  templateUrl: './camfil-guest-form.component.html',
  styleUrls: ['./camfil-guest-form.component.scss'],
})
export class CamfilGuestFormComponent implements OnInit {
  userDetailsFormGroup: FormGroup;
  deliveryInfoFromGroup: FormGroup;
  guestForm: FormGroup;
  showInvoiceAddressForm = false;
  @Output() submit = new EventEmitter<GuestBucketAddress>();

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.guestForm = this.fb.group({
      userDetailsFormGroup: this.initUserDetailsForm(),
      deliveryInfoFromGroup: this.initDeliveryInfoForm(),
      invoiceAddressFormGroup: this.initDeliveryInfoForm(),
    });
  }

  initUserDetailsForm() {
    return this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required]],
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

  onBlurSubmit(fieldName) {
    //  TODO: VAT validation on ERP side
    //  Store entered info in store/localstorage

    console.log('onBlurSubmit', fieldName);
  }

  toggleInvoiceAddressForm() {
    const isChecked = this.guestForm.get(['deliveryInfoFromGroup', 'sameAddressAsInvoice']).value;

    this.showInvoiceAddressForm = !isChecked;
  }

  submitGuestForm() {
    this.submit.emit({
      firstName: this.guestForm.get(['userDetailsFormGroup', 'firstName']).value,
      lastName: this.guestForm.get(['userDetailsFormGroup', 'lastName']).value,
      email: this.guestForm.get(['userDetailsFormGroup', 'email']).value,
      phone: this.guestForm.get(['userDetailsFormGroup', 'phone']).value,
      vat: this.guestForm.get(['userDetailsFormGroup', 'vat']).value,
      jobTitle: this.guestForm.get(['userDetailsFormGroup', 'jobTitle']).value,
      companyName: this.guestForm.get(['userDetailsFormGroup', 'companyName']).value,
      siret: this.guestForm.get(['userDetailsFormGroup', 'siret']).value,
      streetAddress: this.guestForm.get(['deliveryInfoFromGroup', 'streetAddress']).value,
      zipCode: this.guestForm.get(['deliveryInfoFromGroup', 'zipCode']).value,
      city: this.guestForm.get(['deliveryInfoFromGroup', 'city']).value,
      country: this.guestForm.get(['deliveryInfoFromGroup', 'country']).value,
      sameAddressAsInvoice: this.guestForm.get(['deliveryInfoFromGroup', 'sameAddressAsInvoice']).value,
      boxLabel: this.guestForm.get(['deliveryInfoFromGroup', 'boxLabel']).value,
      invoiceMark: this.guestForm.get(['deliveryInfoFromGroup', 'invoiceMark']).value,
      deliveryInfo: this.guestForm.get(['deliveryInfoFromGroup', 'deliveryInfo']).value,
      customerNote: this.guestForm.get(['deliveryInfoFromGroup', 'customerNote']).value,
    });
  }
}
