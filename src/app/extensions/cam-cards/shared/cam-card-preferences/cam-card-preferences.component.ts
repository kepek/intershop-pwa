import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { markAsDirtyRecursive } from 'ish-shared/forms/utils/form-utils';

import { CamCard } from '../../models/cam-card/cam-card.model';

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
export class CamCardPreferencesComponent implements OnChanges {
  constructor(private fb: FormBuilder) {
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

  /**
   *  A reference to the current modal  .
   */

  // localization keys, default = for new

  primaryButton = 'camfil.account.cam_card.new_from_order.button.create.label';
  camCardTitle = 'camfil.account.cam_card.new_cam_card.text';

  customers = [
    {
      value: 'sQJ_AAABWFkAAAF1Q6wJsCII',
      viewValue: 'Bio tech',
    },
  ];

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

  initForm() {
    this.camCardForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(35)]],
      customerName: ['', [Validators.required, Validators.maxLength(35)]],
      orderMark: ['', [Validators.maxLength(35)]],
      invoiceMark: ['', [Validators.maxLength(35)]],
      deliveryAddress: ['', [Validators.maxLength(35)]],
      building: ['', [Validators.maxLength(35)]],
      address: ['', [Validators.maxLength(35)]],
      zipCode: ['', [Validators.maxLength(35)]],
      area: ['', [Validators.maxLength(35)]],
      lastDelivery: ['', [Validators.maxLength(35)]],
      deliveryInterval: ['', [Validators.maxLength(35)]],
      nextDelivery: ['', [Validators.maxLength(35)]],
    });
  }

  patchForm() {
    if (this.camCard) {
      this.camCardForm.setValue({
        title: this.camCard.title,
      });
    }
  }

  /** Emits the cam cards data, when the form was valid. */
  submitCamCardForm() {
    if (this.camCardForm.valid) {
      this.submit.emit({
        title: !this.camCard ? this.camCardForm.get('title').value : this.camCardTitle,
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
