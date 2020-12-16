import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { CamCardsFacade } from '../../../../facades/cam-cards.facade';
import { CamCardAddress, CamCardContact, CamCardCustomer } from '../../../../models/cam-card/cam-card.model';

import { ADDRESS_VALIDATORS } from './validators.js';

@Component({
  selector: 'camfil-delivery-address-form',
  templateUrl: './order-form.component.html',
  styleUrls: ['./order-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderFormComponent implements OnInit, OnDestroy {
  addressForm: FormGroup;
  addresses$: Observable<CamCardAddress[]>;
  validators = ADDRESS_VALIDATORS;

  customers$: Observable<CamCardCustomer[]>;
  contacts: CamCardContact[];

  private destroy$ = new Subject<void>();

  constructor(private fb: FormBuilder, private camCardsFacade: CamCardsFacade) {}

  ngOnInit() {
    this.addresses$ = this.camCardsFacade.addresses$;
    this.customers$ = this.camCardsFacade.customers$;

    this.addressForm = this.fb.group({
      customer: ['', [Validators.required]],
      contact: [''],
      invoiceLabel: ['', [Validators.required, Validators.maxLength(20)]],
      phoneNumber: ['', Validators.pattern('[0-9+-/]*')],
      orderMark: ['', [Validators.required]],
      deliveryAddressSelect: ['', []],
      company: ['', [Validators.required]],
      building: [''],
      address: ['', [Validators.required]],
      zipCode: ['', [Validators.required, Validators.pattern('[0-9]{5}')]],
      area: ['', [Validators.required]],
      info: ['', [Validators.maxLength(150)]],
    });
  }

  pickAddress(event) {
    const id = event.value;
    this.addresses$.subscribe(addresses => {
      const address = addresses.filter(element => element.id === id)[0];

      this.addressForm.patchValue({
        company: address.companyName1,
        address: address.addressLine1,
        building: address.addressLine2,
        zipCode: address.postalCode,
        area: address.city,
      });
    });
  }

  pickCustomer(event) {
    this.camCardsFacade.getDeliveryAddress(event.value);
    this.updateContacts(event);
  }

  updateContacts(event) {
    this.camCardsFacade.loadContactsByCustomer(event.value);
    this.camCardsFacade
      .contactsByCustomer$(event.value)
      .pipe(takeUntil(this.destroy$))
      .subscribe((contacts: CamCardContact[]) => {
        this.contacts = contacts;
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getField(name: string) {
    return this.addressForm.get(name);
  }
}
