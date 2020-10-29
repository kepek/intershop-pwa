import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

import { markAsDirtyRecursive } from 'ish-shared/forms/utils/form-utils';

import { CamCardsFacade } from '../../facades/cam-cards.facade';
import { CamCard, CamCardCustomer, CamCardDelivery } from '../../models/cam-card/cam-card.model';

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
  constructor(private fb: FormBuilder, private camCardsFacade: CamCardsFacade) {
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
  pickerLast;
  pickerNext;
  customers$: Observable<CamCardCustomer[]>;
  addresses$: Observable<CamCardDelivery[]>;

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

  deliveryInterval = [
    {
      value: '1',
      viewValue: '1 week',
    },
    {
      value: '2',
      viewValue: '2 weeks',
    },
  ];

  errorValidator = [
    {
      error: 'required',
      message: 'camfil.account.forgotdata.error.username.required',
    },
  ];

  ngOnChanges() {
    this.patchForm();
    if (this.camCard) {
      this.primaryButton = 'camfil.account.cam_cards.edit_form.save_button.text';
    }
  }
  ngOnInit() {
    this.customers$ = this.camCardsFacade.customers$;
    this.addresses$ = this.camCardsFacade.addresses$;
  }

  initForm() {
    this.camCardForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(35)]],
      customerName: ['', [Validators.required, Validators.maxLength(35)]],
      orderMark: ['', [Validators.maxLength(35)]],
      invoiceMark: ['', [Validators.maxLength(35)]],
      deliveryAddress: ['', [Validators.maxLength(35)]],
      customer: ['', [Validators.maxLength(35)]],
      building: ['', [Validators.maxLength(35)]],
      address: ['', [Validators.maxLength(35)]],
      zipCode: ['', [Validators.maxLength(35)]],
      area: ['', [Validators.maxLength(35)]],
      lastDelivery: ['', [Validators.maxLength(35)]],
      deliveryInterval: ['', [Validators.maxLength(35)]],
      nextDelivery: ['', [Validators.maxLength(35)]],
    });
  }
  compareFn(x, y): boolean {
    return x && y ? x.id === y.id : x === y;
  }

  patchForm() {
    if (this.camCard) {
      this.camCardsFacade.getDeliveryAddress(this.camCard.customer.id);
      this.camCardForm.patchValue({
        title: this.camCard.name,
        customerName: this.camCard.customer.id,
        orderMark: this.camCard.orderLabel,
        invoiceMark: this.camCard.invoiceLabel,
        customer: this.camCard.deliveryAddress.companyName1,
        building: this.camCard.deliveryAddress.addressLine1,
        address: this.camCard.deliveryAddress.street,
        zipCode: this.camCard.deliveryAddress.postalCode,
        area: this.camCard.deliveryAddress.city,
      });
    }
  }

  /** Emits the cam cards data, when the form was valid. */
  submitCamCardForm() {
    if (this.camCardForm.valid) {
      this.submit.emit({
        ...this.camCard,
        id: this.camCard?.id,
        name: this.camCardForm.get('title').value,
        orderLabel: this.camCardForm.get('orderMark').value,
        invoiceLabel: this.camCardForm.get('invoiceMark').value,
        customer: {
          id: this.camCardForm.get('customerName').value,
        },
        deliveryAddress: {
          ...this.camCard?.deliveryAddress,
          companyName1: this.camCardForm.get('customer').value,
          addressLine1: this.camCardForm.get('building').value,
          street: this.camCardForm.get('address').value,
          postalCode: this.camCardForm.get('zipCode').value,
          city: this.camCardForm.get('area').value,
        },
      });
    } else {
      this.submitted = true;
      markAsDirtyRecursive(this.camCardForm);
    }
  }

  pickCustomer(event) {
    this.camCardsFacade.getDeliveryAddress(event.value);
  }

  pickAddress(event) {
    const id = event.value;
    this.addresses$.subscribe(addresses => {
      const address = addresses.filter((element: CamCardDelivery) => element.id === id)[0];
      this.camCardForm.patchValue({
        customer: address.companyName1,
        building: address.addressLine1,
        address: address.street,
        zipCode: address.postalCode,
        area: address.city,
      });
    });
  }
}
