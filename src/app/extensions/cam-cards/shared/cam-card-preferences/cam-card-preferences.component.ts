import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { map, startWith, take, takeUntil } from 'rxjs/operators';

import { AppFacade } from 'ish-core/facades/app.facade';
import { Country } from 'ish-core/models/country/country.model';
import { ProductHelper } from 'ish-core/models/product/product.helper';
import { whenTruthy } from 'ish-core/utils/operators';
import { markAsDirtyRecursive } from 'ish-shared/forms/utils/form-utils';

import { CamCardsFacade } from '../../facades/cam-cards.facade';
import {
  CamCard,
  CamCardAddress,
  CamCardCustomer,
  CamCardCustomersAddresses,
} from '../../models/cam-card/cam-card.model';

/**
 * The Cam Cards Preferences Dialog shows the modal to create/edit a cam_cards.
 *
 * @example
 * <camfil-cam-card-preferences-dialog (submit)="createCamCard($event)"></camfil-cam-card-preferences-dialog>
 */

@Component({
  selector: 'camfil-cam-card-preferences',
  templateUrl: './cam-card-preferences.component.html',
  styleUrls: ['./cam-card-preferences.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamCardPreferencesComponent implements OnChanges, OnInit, AfterViewInit, OnDestroy {
  private static deliveryIntervalOptions = 100;
  @ViewChild('title') titleInput: ElementRef;
  @ViewChild('modal', { static: false }) modalTemplate: TemplateRef<unknown>;

  /**
   * Predefined cam cards to fill the form with, if there is no cam cards a new cam cards will be created
   */
  @Input() camCard: CamCard;
  @Input() modalTitle?: string;

  /**
   * Emits the data of the new cam cards to create.
   */
  @Output() submit = new EventEmitter<CamCard>();

  camCardForm: FormGroup;
  submitted = false;
  isCollapsed = false;
  pickerLast;
  pickerNext;
  customers$: Observable<CamCardCustomer[]>;
  addresses$: Observable<CamCardCustomersAddresses>;
  countries$: Observable<Country[]>;
  customers: CamCardCustomer[];
  selectedAddress: CamCardAddress;
  countryChangeDetect$: Subject<boolean> = new Subject();
  defaultCountryCode: string;
  deliveryIntervalOptions: string[] = [...Array(CamCardPreferencesComponent.deliveryIntervalOptions).keys()].map(i =>
    i === 0 ? '--' : i.toString()
  );
  deliveryIntervalFilteredOptions$: Observable<string[]>;
  setMaxLengthErrorForTableValidator = ProductHelper.setMaxLengthErrorForTableValidator;
  primaryButton = 'camfil.account.cam_card.new_from_order.button.create.label';
  camCardTitle = 'camfil.account.cam_card.new_cam_card.text';
  maxLength = 35;
  locations = [
    {
      value: 'poland',
      viewValue: 'Poland',
    },
    {
      value: 'norway',
      viewValue: 'Norway',
    },
    {
      value: 'sweden',
      viewValue: 'Sweden',
    },
  ];
  errorValidator = [
    {
      error: 'required',
      message: 'helpdesk.contactus.indicates',
    },
    {
      error: 'incorrect',
      message: 'camfil.address_form.post_code.invalid',
    },
    {
      error: 'maxlength',
      message: 'camfil.form.error.maxLength',
      messageVariables: [],
    },
  ];

  private destroy$ = new Subject();

  constructor(
    private fb: FormBuilder,
    private camCardsFacade: CamCardsFacade,
    private appFacade: AppFacade,
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  get formDisabled() {
    return this.camCardForm.invalid && this.submitted;
  }

  get collapseFormTranslationKey() {
    return this.isCollapsed
      ? 'camfil.account.cam_card_preferences.maximize'
      : 'camfil.account.cam_card_preferences.minimize';
  }

  get customerId() {
    return this.camCardForm?.get('customerName')?.value || '';
  }

  hide() {
    this.dialog.closeAll();
  }

  show() {
    this.dialog.open(this.modalTemplate, {
      width: '300px',
    });
  }

  acceptReminder(allow) {
    const currentValue = this.camCardForm.get('reminder').value;

    if (allow) {
      this.camCardForm.patchValue({
        reminder: !currentValue,
      });
      this.submitCamCardForm();
    }

    this.hide();
  }

  preventDefault(event) {
    if (this.camCard) {
      event.preventDefault();
      this.toggleReminder();
    }
  }

  toggleReminder() {
    this.show();
  }

  ngOnChanges() {
    if (this.camCardForm) {
      this.patchForm();
    }
    if (this.camCard) {
      this.primaryButton = 'camfil.account.cam_card.edit_form.save_button.text';
    }
  }

  ngOnInit() {
    this.initForm();
    this.countries$ = this.appFacade.countries$();
    this.customers$ = this.camCardsFacade.customers$;
    this.addresses$ = this.camCardsFacade.addresses$;

    this.appFacade.getCountryCodeByChannel$
      .pipe(takeUntil(this.destroy$))
      .subscribe(code => (this.defaultCountryCode = code));

    this.activatedRoute.queryParams.pipe(take(1)).subscribe(queryParam => {
      const copy = 'copy';
      if (queryParam[copy] === 'true') {
        this.camCardForm.patchValue({ title: '' });
        this.camCardForm.get('title').setErrors({ required: true });
        this.camCardForm.get('title').markAsTouched();
      }
    });

    this.customers$.pipe(whenTruthy(), take(2)).subscribe(customers => {
      if (customers.length === 1) {
        this.camCardForm.patchValue({
          customerName: customers[0].id,
        });
        this.pickCustomer({ value: customers[0].id });
      }
      this.customers = customers;
    });

    this.deliveryIntervalFilteredOptions$ = this.camCardForm.get('deliveryInterval').valueChanges.pipe(
      startWith(''),
      map(value => this._deliveryIntervalFilter(value))
    );
  }

  ngAfterViewInit() {
    this.setFocusOnCamCardTitleInputField();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  initForm() {
    const maxL = this.maxLength;
    this.camCardForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(40)]],
      customerName: ['', [Validators.required]],
      orderMark: [''],
      invoiceMark: [''],
      deliveryAddress: ['', [Validators.maxLength(maxL)]],
      companyName1: [''],
      addressLine1: ['', [Validators.maxLength(250)]],
      postalCode: ['', [Validators.required, Validators.maxLength(maxL)]],
      city: [{ value: '', disabled: true }, [Validators.maxLength(maxL)]],
      lastDelivery: ['', [Validators.maxLength(maxL)]],
      deliveryInterval: ['', [Validators.maxLength(maxL)]],
      nextDelivery: [{ value: '', disabled: true }, [Validators.maxLength(maxL)]],
      reminder: [true, [Validators.maxLength(maxL)]],
    });
    this.patchForm();
  }

  setFocusOnCamCardTitleInputField() {
    this.customers$.pipe(whenTruthy(), take(2)).subscribe(customers => {
      if (customers.length === 1) {
        this.titleInput?.nativeElement.focus();
        this.cdr.detectChanges();
      }
    });
  }

  patchForm() {
    if (this.camCard) {
      if (this.addresses$ === undefined) {
        this.camCardsFacade.getDeliveryAddress(this.camCard.customer.id);
      }
      const {
        name,
        customer,
        orderLabel,
        invoiceLabel,
        deliveryAddress,
        lastDeliveryDate,
        deliveryInterval,
        nextDeliveryDate,
        reminderFlag,
      } = this.camCard;
      const { addressLine1, postalCode, city, companyName1 } = deliveryAddress;
      this.camCardForm.patchValue({
        title: name,
        customerName: customer.id,
        orderMark: orderLabel,
        invoiceMark: invoiceLabel,
        companyName1,
        addressLine1,
        postalCode,
        city,
        lastDelivery: lastDeliveryDate ? new Date(lastDeliveryDate) : '',
        deliveryInterval: deliveryInterval === 0 ? '' : deliveryInterval,
        nextDelivery: nextDeliveryDate ? new Date(nextDeliveryDate) : '',
        reminder: reminderFlag,
      });
    }
  }

  onBlurSubmit() {
    if (this.camCard) {
      this.submitCamCardForm();
    }
  }

  setZipCodeError(event) {
    this.camCardForm.controls.postalCode.setErrors(event);
    this.camCardForm.updateValueAndValidity();
  }

  checkZipCode() {
    this.countryChangeDetect$.next(true);
  }

  /** Emits the cam cards data, when the form was valid. */
  submitCamCardForm() {
    if (this.camCardForm.valid) {
      const nextDelivery = this.camCardForm.get('nextDelivery').value;
      const lastDelivery = this.camCardForm.get('lastDelivery').value;
      const customerId = this.customerId;
      this.submit.emit({
        ...this.camCard,
        id: this.camCard?.id,
        name: this.camCardForm.get('title').value,
        orderLabel: this.camCardForm.get('orderMark').value,
        invoiceLabel: this.camCardForm.get('invoiceMark').value,
        customer: {
          id: customerId,
          customerNo: this.customers.find(item => item.id === customerId).customerNo,
        },
        deliveryAddress: {
          ...this.camCard?.deliveryAddress,
          companyName1: this.camCardForm.get('companyName1').value,
          addressLine1: this.camCardForm.get('addressLine1').value,
          addressLine2: '',
          street: this.camCardForm.get('addressLine1').value,
          postalCode: this.camCardForm.get('postalCode').value,
          city: this.camCardForm.get('city').value,
          countryCode: this.defaultCountryCode,
        },
        nextDeliveryDate: nextDelivery ? this.dateToSend(nextDelivery) : '',
        lastDeliveryDate: lastDelivery ? this.dateToSend(lastDelivery) : '',
        deliveryInterval: isNaN(this.camCardForm.get('deliveryInterval').value)
          ? undefined
          : this.camCardForm.get('deliveryInterval').value,
        reminderFlag: this.camCardForm.get('reminder').value,
      });
    } else {
      this.submitted = true;
      Object.keys(this.camCardForm.controls).forEach(field => {
        const control = this.camCardForm.get(field);
        control.markAsTouched({ onlySelf: true });
      });
      markAsDirtyRecursive(this.camCardForm);
    }
  }

  dateToSend(date) {
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toJSON();
  }

  pickCustomer(event) {
    if (event.value) {
      this.camCardsFacade.getDeliveryAddress(event.value);
    }
  }

  pickAddress(event) {
    const id = event.value;
    this.addresses$.subscribe(addresses => {
      const customerId = this.customerId;
      const address = addresses[customerId]?.filter(element => element.id === id)[0];
      if (address) {
        this.selectedAddress = address;
      }
    });

    if (this.selectedAddress) {
      this.camCardForm.patchValue({
        deliveryAddress: this.selectedAddress.id,
        companyName1: this.selectedAddress.companyName1,
        addressLine1: this.selectedAddress.addressLine1,
        postalCode: this.selectedAddress.postalCode,
        city: this.selectedAddress.city,
      });
      this.onBlurSubmit();
    }
  }

  pickOrder() {
    const date = new Date(this.camCardForm.get('lastDelivery').value);
    const interval = this.camCardForm.get('deliveryInterval').value;

    if (interval) {
      date.setMonth(date.getMonth() + interval);
      this.camCardForm.patchValue({
        nextDelivery: date,
      });
      this.onBlurSubmit();
    }
  }

  pickInterval() {
    const date = new Date(this.camCardForm.get('lastDelivery').value);
    date.setMonth(
      date.getMonth() +
        (isNaN(this.camCardForm.get('deliveryInterval').value) ? 0 : this.camCardForm.get('deliveryInterval').value)
    );
    this.camCardForm.patchValue({
      nextDelivery: date,
    });
  }

  applyDeliveryInterval() {
    if (this.camCardForm.get('deliveryInterval').value === '--') {
      this.camCardForm.get('deliveryInterval').setValue(undefined);
    }
    this.pickInterval();
    this.onBlurSubmit();
  }

  validateDeliveryInterval() {
    const maxDeliveryInterval = CamCardPreferencesComponent.deliveryIntervalOptions - 1;
    if (this.camCardForm.get('deliveryInterval').value === '--') {
      this.camCardForm.get('deliveryInterval').setValue(undefined);
      return;
    }
    if (this.camCardForm.get('deliveryInterval').value > maxDeliveryInterval) {
      this.camCardForm.get('deliveryInterval').setValue(`${maxDeliveryInterval}`);
      return;
    }
    if (this.camCardForm.get('deliveryInterval').value <= 0) {
      this.camCardForm.get('deliveryInterval').setValue(undefined);
      return;
    }
  }

  private _deliveryIntervalFilter(value: string): string[] {
    if (!value) {
      return this.deliveryIntervalOptions;
    }
    return this.deliveryIntervalOptions.filter(option => option.toLowerCase().startsWith(value.toString()));
  }
}
