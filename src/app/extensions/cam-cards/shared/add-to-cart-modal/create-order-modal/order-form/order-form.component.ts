import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import { EditBucket } from 'ish-core/models/basket/bucket.model';
import { whenTruthy } from 'ish-core/utils/operators';

import { CamCardsFacade } from '../../../../facades/cam-cards.facade';
import { CamCardAddress, CamCardContact, CamCardCustomer } from '../../../../models/cam-card/cam-card.model';

import { ADDRESS_VALIDATORS } from './validators.js';

@Component({
  selector: 'camfil-order-form',
  templateUrl: './order-form.component.html',
  styleUrls: ['./order-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderFormComponent implements OnInit, OnDestroy {
  addressForm: FormGroup;
  addresses$: Observable<CamCardAddress[]>;
  validators = ADDRESS_VALIDATORS;

  customers$: Observable<CamCardCustomer[]>;
  customersArr: CamCardCustomer[];
  contacts: CamCardContact[];

  @Input() orderToEdit?: EditBucket;
  @Input() edit?: boolean;

  private destroy$ = new Subject<void>();

  constructor(private fb: FormBuilder, private camCardsFacade: CamCardsFacade) {}

  ngOnInit() {
    this.addresses$ = this.camCardsFacade.addresses$;
    this.customers$ = this.camCardsFacade.customers$;

    this.customers$?.pipe(whenTruthy(), takeUntil(this.destroy$)).subscribe(customers => {
      this.customersArr = customers;
    });

    this.addressForm = this.fb.group({
      customer: [this.orderToEdit?.customerId || this.setDefaultCustomer(this.customersArr), [Validators.required]],
      contact: [this.orderToEdit?.contactPerson?.erpId || '', Validators.required],
      invoiceLabel: [this.orderToEdit?.invoiceLabel || '', [Validators.maxLength(20)]],
      phoneNumber: [this.orderToEdit?.phoneNumber || '', Validators.pattern('[0-9+-/]*')],
      orderMark: [this.orderToEdit?.orderMark || ''],
      deliveryAddressSelect: [this.orderToEdit?.deliveryAddressId || '', []],
      company: [this.orderToEdit?.company || '', [Validators.required]],
      building: [this.orderToEdit?.building || ''],
      address: [this.orderToEdit?.address || '', [Validators.required]],
      zipCode: [this.orderToEdit?.zipCode || '', [Validators.required, Validators.pattern('[0-9]{5}')]],
      area: [this.orderToEdit?.area || '', [Validators.required]],
      info: [this.orderToEdit?.info || '', [Validators.maxLength(150)]],
      contactFull: [],
      addressFull: [],
      customerFull: [],
    });

    if (this.orderToEdit && this.orderToEdit.customerId) {
      this.pickCustomer({ value: this.orderToEdit.customerId });
    }
  }

  pickAddress(event) {
    const id = event.value;
    this.addresses$.subscribe(addresses => {
      const address = addresses.filter(element => element.id === id)[0];
      this.addressForm?.patchValue({
        company: address?.addressName,
        address: address?.addressLine1,
        building: address?.addressLine2,
        zipCode: address?.postalCode,
        area: address?.city,
        addressFull: address,
      });
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

        if (this.orderToEdit?.contactPerson && this.orderToEdit.customerId === this.getField('customer')?.value) {
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
}
