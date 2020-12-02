import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { AppFacade } from 'ish-core/facades/app.facade';
import { Country } from 'ish-core/models/country/country.model';
import { markAsDirtyRecursive } from 'ish-shared/forms/utils/form-utils';

import { CamCardsFacade } from '../../facades/cam-cards.facade';
import { CamCard, CamCardAddress, CamCardCustomer } from '../../models/cam-card/cam-card.model';

/**
 * The Cam Cards Preferences Dialog shows the modal to create/edit a cam_cards.
 *
 * @example
 * <camfil-cam-card-preferences-dialog
    (submit)="createCamCard($event)">
   </camfil-cam-card-preferences-dialog>
 */
@Component({
  selector: 'camfil-cam-card-preferences',
  templateUrl: './cam-card-preferences.component.html',
  styleUrls: ['./cam-card-preferences.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamCardPreferencesComponent implements OnChanges, OnInit {
  constructor(
    private fb: FormBuilder,
    private camCardsFacade: CamCardsFacade,
    private appFacade: AppFacade,
    public dialog: MatDialog,
    private activatedRoute: ActivatedRoute
  ) {
    this.initForm();
  }

  get formDisabled() {
    return this.camCardForm.invalid && this.submitted;
  }
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
  addresses$: Observable<CamCardAddress[]>;
  countries$: Observable<Country[]>;

  /**
   *  A reference to the current modal  .
   */

  // localization keys, default = for new

  primaryButton = 'camfil.account.cam_card.new_from_order.button.create.label';
  camCardTitle = 'camfil.account.cam_card.new_cam_card.text';

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

  deliveryInterval = [...Array(999).keys()].map(i => ({
    value: i + 1,
    viewValue: i + 1,
  }));

  errorValidator = [
    {
      error: 'required',
      message: 'helpdesk.contactus.indicates',
    },
  ];

  @ViewChild('modal', { static: false }) modalTemplate: TemplateRef<unknown>;

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
    this.patchForm();
    if (this.camCard) {
      this.primaryButton = 'camfil.account.cam_cards.edit_form.save_button.text';
    }
  }

  ngOnInit() {
    this.countries$ = this.appFacade.countries$();
    this.customers$ = this.camCardsFacade.customers$;
    this.addresses$ = this.camCardsFacade.addresses$;

    this.activatedRoute.queryParams.pipe(take(1)).subscribe(queryParam => {
      const copy = 'copy';
      if (queryParam[copy] === 'true') {
        this.camCardForm.patchValue({ title: '' });
        this.camCardForm.get('title').setErrors({ required: true });
        this.camCardForm.get('title').markAsTouched();
      }
    });
  }

  initForm() {
    this.camCardForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(35)]],
      customerName: ['', [Validators.required, Validators.maxLength(35)]],
      orderMark: ['', [Validators.maxLength(35)]],
      invoiceMark: ['', [Validators.maxLength(35)]],
      deliveryAddress: ['', [Validators.maxLength(35)]],
      addressLine1: ['', [Validators.required, Validators.maxLength(35)]],
      addressLine2: ['', [Validators.maxLength(35)]],
      postalCode: ['', [Validators.required, Validators.maxLength(35)]],
      city: ['', [Validators.required, Validators.maxLength(35)]],
      countryCode: ['', [Validators.required, Validators.maxLength(35)]],
      lastDelivery: ['', [Validators.maxLength(35)]],
      deliveryInterval: ['', [Validators.maxLength(35)]],
      nextDelivery: ['', [Validators.maxLength(35)]],
      reminder: ['', [Validators.maxLength(35)]],
    });
  }
  compareFn(x, y): boolean {
    return x && y ? x.id === y.id : x === y;
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
      const { addressLine1, addressLine2, postalCode, city, countryCode } = deliveryAddress;
      this.camCardForm.patchValue({
        title: name,
        customerName: customer.customerNo,
        orderMark: orderLabel,
        invoiceMark: invoiceLabel,
        addressLine1,
        addressLine2,
        postalCode,
        city,
        countryCode,
        lastDelivery: lastDeliveryDate ? new Date(lastDeliveryDate) : '',
        deliveryInterval,
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

  /** Emits the cam cards data, when the form was valid. */
  submitCamCardForm() {
    if (this.camCardForm.valid) {
      const nextDelivery = this.camCardForm.get('nextDelivery').value;
      const lastDelivery = this.camCardForm.get('lastDelivery').value;
      this.submit.emit({
        ...this.camCard,
        id: this.camCard?.id,
        name: this.camCardForm.get('title').value,
        orderLabel: this.camCardForm.get('orderMark').value,
        invoiceLabel: this.camCardForm.get('invoiceMark').value,
        customer: {
          id: this.camCardForm.get('customerName').value,
          customerNo: this.camCardForm.get('customerName').value,
        },
        deliveryAddress: {
          ...this.camCard?.deliveryAddress,
          addressLine1: this.camCardForm.get('addressLine1').value,
          street: this.camCardForm.get('addressLine1').value,
          addressLine2: this.camCardForm.get('addressLine2').value,
          postalCode: this.camCardForm.get('postalCode').value,
          city: this.camCardForm.get('city').value,
          countryCode: this.camCardForm.get('countryCode').value,
        },
        nextDeliveryDate: nextDelivery ? this.dateToSend(nextDelivery) : '',
        lastDeliveryDate: lastDelivery ? this.dateToSend(lastDelivery) : '',
        deliveryInterval: this.camCardForm.get('deliveryInterval').value,
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
    this.camCardsFacade.getDeliveryAddress(event.value);
  }

  pickAddress(event) {
    const id = event.value;
    this.addresses$.subscribe(addresses => {
      const address = addresses.filter(element => element.id === id)[0];

      this.camCardForm.patchValue({
        addressLine1: address.addressLine1,
        addressLine2: address.addressLine2,
        postalCode: address.postalCode,
        city: address.city,
        countryCode: address.countryCode,
      });

      this.onBlurSubmit();
    });
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

  pickInterval({ value }) {
    const date = new Date(this.camCardForm.get('lastDelivery').value);

    date.setMonth(date.getMonth() + value);
    this.camCardForm.patchValue({
      nextDelivery: date,
    });
  }
  get collapseFormTranslationKey() {
    return this.isCollapsed
      ? 'camfil.account.cam_card_preferences.maximize'
      : 'camfil.account.cam_card_preferences.minimize';
  }
}
