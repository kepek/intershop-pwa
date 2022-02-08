import { ChangeDetectionStrategy, Component, EventEmitter, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { markAsDirtyRecursive } from 'ish-shared/forms/utils/form-utils';

import { REJECT_FORM_VALIDATORS } from './validators.js';

/**
 * The Wishlist Reject Approval Dialog shows the modal to reject a requisition.
 *
 * @example
 * <camfil-requisition-reject-dialog
    (submit)="rejectRequisition($event)">
   </camfil-requisition-reject-dialog>
 */
@Component({
  selector: 'camfil-requisition-reject-dialog',
  templateUrl: './camfil-requisition-reject-dialog.component.html',
  styleUrls: ['./camfil-requisition-reject-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilRequisitionRejectDialogComponent {
  /**
   * Emits the reject event with the reject comment.
   */
  @Output() submit = new EventEmitter<string>();
  validators = REJECT_FORM_VALIDATORS;
  rejectForm: FormGroup;
  submitted = false;

  /**
   *  A reference to the current modal.
   */
  modal: NgbModalRef;

  @ViewChild('modal') modalTemplate: TemplateRef<unknown>;

  constructor(private ngbModal: NgbModal) {
    this.initForm();
  }

  initForm() {
    this.rejectForm = new FormGroup({
      comment: new FormControl('', Validators.required),
    });
  }

  /** Emits the reject comment data, when the form was valid. */
  submitForm() {
    if (this.rejectForm.valid) {
      this.submit.emit(this.rejectForm.get('comment').value);

      this.hide();
    } else {
      this.submitted = true;
      markAsDirtyRecursive(this.rejectForm);
    }
  }

  /** Opens the modal. */
  show() {
    this.modal = this.ngbModal.open(this.modalTemplate);
  }

  getField(name: string) {
    return this.rejectForm?.get(name);
  }

  /** Close the modal. */
  hide() {
    this.rejectForm.reset({
      comment: '',
    });
    this.submitted = false;
    if (this.modal) {
      this.modal.close();
    }
  }

  get formDisabled() {
    console.log();
    return this.rejectForm.invalid && this.submitted;
  }
}
