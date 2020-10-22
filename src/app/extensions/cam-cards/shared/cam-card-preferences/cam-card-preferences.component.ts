import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

import { markAsDirtyRecursive } from 'ish-shared/forms/utils/form-utils';

import { CamCardsFacade } from '../../facades/cam-cards.facade';
import { CamCard, CamCardCustomer } from '../../models/cam-card/cam-card.model';

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

  ngOnChanges() {
    this.patchForm();
    if (this.camCard) {
      this.primaryButton = 'camfil.account.cam_cards.edit_form.save_button.text';
    }
  }
  ngOnInit() {
    this.customers$ = this.camCardsFacade.customers$;
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
      this.camCardForm.patchValue({
        title: this.camCard.name,
        customerName: this.camCard.customer.name,
        orderMark: this.camCard.orderLabel,
        invoiceMark: this.camCard.invoiceLabel,
      });
    }
  }

  /** Emits the cam cards data, when the form was valid. */
  submitCamCardForm() {
    if (this.camCardForm.valid) {
      this.submit.emit({
        id: this.camCard?.id,
        name: this.camCardForm.get('title').value,
        orderLabel: this.camCardForm.get('orderMark').value,
        invoiceLabel: this.camCardForm.get('invoiceMark').value,
        customer: {
          id: this.camCardForm.get('customerName').value,
        },
      });
    } else {
      this.submitted = true;
      markAsDirtyRecursive(this.camCardForm);
    }
  }
}
