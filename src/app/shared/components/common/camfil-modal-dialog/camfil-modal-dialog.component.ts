import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

export interface ModalOptions {
  /**
   * Modal title string.
   */
  titleText: string;
  /**
   * size attribute
   *   ex.: 330px
   */
  size?: 'string';
  /**
   * Optional modal confirm button text.
   */
  confirmText?: string;
  /**
   * Optional modal confirm button disabled.
   */
  confirmDisabled?: boolean;
  /**
   * Optional modal reject button text.
   */
  rejectText?: string;

  icon?: string;
}

/**
 * The Modal Dialog Component displays a generic modal, that shows a custom title and custom content.
 * It provides an optional footer that includes confirm and reject buttons.
 * It is possible to pass any data on show.
 * The also provided confirmed output emitter will return the previously passed data if the modal gets confirmed.
 *
 * @example
 * <camfil-modal-dialog [options]="options" (confirmed)="onConfirmed($event)">
 *   Dummy content
 * </camfil-modal-dialog>
 */
@Component({
  selector: 'camfil-modal-dialog',
  templateUrl: './camfil-modal-dialog.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilModalDialogComponent<T> {
  @Input() options: ModalOptions;

  @Output() confirmed = new EventEmitter<T>();
  @Output() onClosed = new EventEmitter<T>();

  @ViewChild('template') modalDialogTemplate: TemplateRef<unknown>;

  ngbModalRef: NgbModalRef;
  data: T;
  dialogRef: MatDialogRef<any>;

  constructor(public dialog: MatDialog) {}
  /**
   * Configure and show modal dialog.
   */
  show(data?: T) {
    if (data) {
      this.data = data;
    }

    const size = this.options && this.options.size ? this.options.size : undefined;

    this.dialogRef = this.dialog.open(this.modalDialogTemplate, { width: size });

    return this.dialogRef;
  }

  /**
   * Hides modal dialog.
   */
  hide() {
    this.onClosed.emit(this.data);
    this.dialog.closeAll();
    return this.dialogRef;
  }

  /**
   * Emits input data or undefined and hides modal.
   */
  confirm() {
    this.confirmed.emit(this.data);
    this.hide();
  }
}
