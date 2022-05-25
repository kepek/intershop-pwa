import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CamfilConfigurationFacade } from 'camfil-pwa/facades/camfil-configuration.facade';
import { Observable, Subject } from 'rxjs';
import { distinctUntilChanged, take, takeUntil } from 'rxjs/operators';

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
  // tslint:disable-next-line: no-host-metadata-property
  host: {
    '(window:resize)': 'onResize()',
  },
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
  useSecondAddressLine: boolean;
  maxHeight = 65;

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private camCardsFacade: CamCardsFacade,
    private camfilConfigurationFacade: CamfilConfigurationFacade
  ) {}

  get customerId() {
    return this.addressForm?.get('customer')?.value || '';
  }

  ngOnInit() {
    this.addresses$ = this.camCardsFacade.addresses$;
    this.customers$ = this.camCardsFacade.customers$;

    this.camfilConfigurationFacade
      .isEnabled$('useSecondAddressLine')
      .pipe(take(1))
      .subscribe(val => {
        this.useSecondAddressLine = val;
      });

    this.addressForm = this.fb.group({
      customer: [this.orderToEdit?.customerId],
      contact: [this.orderToEdit?.contactPerson?.erpId || '', Validators.required],
      invoiceLabel: [this.orderToEdit?.invoiceLabel || ''],
      phoneNumber: [this.orderToEdit?.phoneNumber || '', Validators.pattern('[0-9+-/]*')],
      orderMark: [this.orderToEdit?.orderMark || '', [Validators.maxLength(60)]],
      deliveryAddressSelect: [this.orderToEdit?.deliveryAddressId || '', []],
      company: [this.orderToEdit?.company || ''],
      address: [this.orderToEdit?.address || ''],
      addressLine2: [this.orderToEdit?.addressLine2 || ''],
      citySelect: [],
      zipCode: [this.orderToEdit?.zipCode || ''],
      area: [{ value: this.orderToEdit?.area || '', disabled: true }, [Validators.required]],
      info: [this.orderToEdit?.info || '', [Validators.maxLength(150)]],
      contactFull: [],
      addressFull: [],
      customerFull: [],
      goodsAcceptanceNote: '',
    });

    this.camfilConfigurationFacade.zipCodeRegExp$.pipe(take(1), takeUntil(this.destroy$)).subscribe(zipCodeRegExp => {
      this.addressForm.get('zipCode').setValidators([Validators.required, Validators.pattern(zipCodeRegExp)]);
    });

    this.customers$?.pipe(whenTruthy(), distinctUntilChanged(), takeUntil(this.destroy$)).subscribe(customers => {
      this.customersArr = customers;
      const defaultCustomerId = this.setDefaultCustomer(this.customersArr);

      if (!this.orderToEdit && customers?.length === 1) {
        this.setDefaultFullCustomer(defaultCustomerId);
      }

      if (!this.orderToEdit?.customerId) {
        this.addressForm?.patchValue({ customer: defaultCustomerId });
      }
    });

    if (this.orderToEdit && this.orderToEdit.customerId) {
      this.pickCustomer({ value: this.orderToEdit.customerId });
    }

    this.onResize();
  }

  pickAddress(event) {
    const id = event.value;
    this.addresses$.subscribe(addresses => {
      const address = addresses[this.customerId]?.filter(element => element.id === id)[0];
      if (address) {
        this.addressForm?.patchValue({
          company: address?.addressName,
          address: address?.addressLine1,
          addressLine2: address?.addressLine2,
          zipCode: address?.postalCode,
          area: address?.city,
          addressFull: address,
          goodsAcceptanceNote: address?.goodsAcceptanceNote,
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
            .pipe(whenTruthy(), take(1))
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

  onResize() {
    const isMobileView = window.innerWidth <= 768;

    const maxHeightSteps = [
      {
        heightTresholdMax: 700,
        heightTresholdMin: 601,
        heightValue: 55,
      },
      {
        heightTresholdMax: 600,
        heightTresholdMin: 501,
        heightValue: 45,
      },
      {
        heightTresholdMax: 500,
        heightTresholdMin: 0,
        heightValue: 35,
      },
    ];

    if (!isMobileView) {
      const heightValue = maxHeightSteps.find(
        step => window.innerHeight <= step.heightTresholdMax && window.innerHeight >= step.heightTresholdMin
      )?.heightValue;

      this.maxHeight = heightValue ? heightValue : 65;
    }
  }
}
