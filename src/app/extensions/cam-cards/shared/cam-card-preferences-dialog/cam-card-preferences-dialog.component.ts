import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

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
  selector: 'camfil-cam-card-preferences-dialog',
  templateUrl: './cam-card-preferences-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamCardPreferencesDialogComponent implements OnChanges {
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

  /**
   *  A reference to the current modal.
   */
  modal: NgbModalRef;

  // localization keys, default = for new

  primaryButton = 'camfil.account.cam_card.new_from_order.button.create.label';
  camCardTitle = 'camfil.account.cam_card.new_cam_card.text';
  modalHeader = 'camfil.account.cam_cards.list.button.add_cam_card.label';

  @ViewChild('modal', { static: false }) modalTemplate: TemplateRef<unknown>;

  constructor(private fb: FormBuilder, private ngbModal: NgbModal) {
    this.initForm();
  }

  ngOnChanges() {
    this.patchForm();
    this.modalHeader = this.modalTitle || this.modalHeader;
    if (this.camCard) {
      this.primaryButton = 'camfil.account.cam_cards.edit_form.save_button.text';
      this.camCardTitle = this.camCard.title;
      this.modalHeader = 'camfil.account.cam_card.edit.heading';
    }
  }

  initForm() {
    this.camCardForm = this.fb.group({ title: ['', [Validators.required, Validators.maxLength(35)]] });
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
        id: !this.camCard ? this.camCardForm.get('title').value : this.camCardTitle,
        title: this.camCardForm.get('title').value,
      });

      this.hide();
    } else {
      this.submitted = true;
      markAsDirtyRecursive(this.camCardForm);
    }
  }

  /** Opens the modal. */
  show() {
    this.modal = this.ngbModal.open(this.modalTemplate);
  }

  /** Close the modal. */
  hide() {
    this.camCardForm.reset({
      title: '',
    });
    this.submitted = false;
    if (this.modal) {
      this.modal.close();
    }
  }

  get formDisabled() {
    return this.camCardForm.invalid && this.submitted;
  }
}
