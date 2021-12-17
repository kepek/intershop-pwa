import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import { EditBucket } from 'ish-core/models/bucket/bucket.model';
import { ProductHelper } from 'ish-core/models/product/product.helper';
import { whenTruthy } from 'ish-core/utils/operators';
import { ZipCodeComponent } from 'ish-shared/components/zip-code/zip-code.component';

import { CamCardsFacade } from '../../../../facades/cam-cards.facade';
import { CamCardContact, CamCardCustomer, CamCardCustomersAddresses } from '../../../../models/cam-card/cam-card.model';

import { ADDRESS_VALIDATORS } from './validators.js';

@Component({
  selector: 'camfil-order-form',
  templateUrl: './order-form.component.html',
  styleUrls: ['./order-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderFormComponent implements OnInit, OnDestroy {
  addressForm: FormGroup;
  addresses$: Observable<CamCardCustomersAddresses>;
  validators = ADDRESS_VALIDATORS;

  customers$: Observable<CamCardCustomer[]>;
  customersArr: CamCardCustomer[];
  contacts: CamCardContact[];

  @ViewChild(ZipCodeComponent) zipCodeComponent: ZipCodeComponent;

  @Input() orderToEdit?: EditBucket;
  @Input() edit?: boolean;
  setMaxLengthValidation = ProductHelper.setMaxLengthValidation;
  private destroy$ = new Subject<void>();

  constructor(private fb: FormBuilder, private camCardsFacade: CamCardsFacade) {}

  get customerId() {
    return this.addressForm?.get('customer')?.value || '';
  }

  ngOnInit() {
    this.addresses$ = this.camCardsFacade.addresses$;
    this.customers$ = this.camCardsFacade.customers$;
    this.customers$?.pipe(whenTruthy(), takeUntil(this.destroy$)).subscribe(customers => {
      this.customersArr = customers;
    });

    this.addressForm = this.fb.group({
      customer: [this.orderToEdit?.customerId || this.setDefaultCustomer(this.customersArr)],
      contact: [this.orderToEdit?.contactPerson?.erpId || '', Validators.required],
      invoiceLabel: [this.orderToEdit?.invoiceLabel || ''],
      phoneNumber: [this.orderToEdit?.phoneNumber || '', Validators.pattern('[0-9+-/]*')],
      orderMark: [this.orderToEdit?.orderMark || '', [Validators.maxLength(60)]],
      deliveryAddressSelect: [this.orderToEdit?.deliveryAddressId || '', []],
      company: [this.orderToEdit?.company || ''],
      address: [this.orderToEdit?.address || ''],
      citySelect: [],
      zipCode: [this.orderToEdit?.zipCode || '', [Validators.required, Validators.pattern('[0-9]{5}')]],
      area: [{ value: this.orderToEdit?.area || '', disabled: true }, [Validators.required]],
      info: [this.orderToEdit?.info || '', [Validators.maxLength(150)]],
      contactFull: [],
      addressFull: [],
      customerFull: [],
    });

    if (!this.orderToEdit && this.customersArr?.length === 1) {
      this.setDefaultFullCustomer(this.setDefaultCustomer(this.customersArr));
    }

    if (this.orderToEdit && this.orderToEdit.customerId) {
      this.pickCustomer({ value: this.orderToEdit.customerId });
    }
  }

  pickAddress(event) {
    const id = event.value;
    this.addresses$.subscribe(addresses => {
      const address = addresses[this.customerId]?.filter(element => element.id === id)[0];
      if (address) {
        this.addressForm?.patchValue({
          company: address?.addressName,
          address: address?.addressLine1,
          zipCode: address?.postalCode,
          area: address?.city,
          addressFull: address,
        });
        this.zipCodeComponent.checkZipCode();
      }
    });
  }

  pickCustomer(event) {
    this.camCardsFacade.getDeliveryAddress(event.value);
    const selectedCustomer = this.customersArr?.find(customer => customer.id === event.value);
    this.addressForm?.patchValue({ customerFull: selectedCustomer });
    this.updateContacts(event);
  }

  updateContacts(event) {
    this.camCardsFacade.loadContactsByCustomer(event.value);
    this.camCardsFacade
      .contactsByCustomer$(event.value)
      .pipe(takeUntil(this.destroy$))
      .subscribe((contacts: CamCardContact[]) => {
        this.contacts = contacts;

        if (this.orderToEdit?.contactPerson && this.orderToEdit.customerId === this.customerId) {
          const erpId = this.orderToEdit.contactPerson.erpId;
          this.addressForm?.patchValue({ contact: erpId });
          this.pickContact({ value: erpId });
        } else {
          this.camCardsFacade
            .getUserContactForCustomer$(event.value)
            .pipe(take(1))
            .subscribe((contactPerson: CamCardContact) => {
              this.addressForm?.patchValue({ contact: contactPerson.erpId });
              this.pickContact({ value: contactPerson.erpId });
            });
        }
      });
  }

  pickContact(event) {
    const selectedContact = this.contacts?.find(contact => contact.erpId === event.value);
    this.addressForm?.patchValue({ contactFull: selectedContact });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getField(name: string) {
    return this.addressForm?.get(name);
  }

  setDefaultCustomer(customersArr: CamCardCustomer[]) {
    let defaultCustomerId = '';

    if (customersArr?.length === 1) {
      defaultCustomerId = customersArr[0].id;
      this.updateContacts({ value: defaultCustomerId });
      this.camCardsFacade.getDeliveryAddress(defaultCustomerId);
    }

    return defaultCustomerId;
  }

  setDefaultFullCustomer(customerId: string) {
    const selectedCustomer = this.customersArr?.find(customer => customer.id === customerId);
    this.addressForm?.patchValue({ customerFull: selectedCustomer });
  }
}
