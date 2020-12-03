import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, TemplateRef, ViewChild } from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'camfil-confirmation-modal',
  templateUrl: './camfil-confirmation-modal.component.html',
  styleUrls: ['./camfil-confirmation-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilConfirmationModalComponent {
  modal: NgbModalRef;

  @ViewChild('modal', { static: false }) modalTemplate: TemplateRef<unknown>;

  @Input() confirmationBody?: TemplateRef<any>;
  @Input() actionTitle?: string;
  @Input() actionButtonTitle?: string;

  @Output() actionClicked = new EventEmitter<any>();

  emitAction() {
    this.actionClicked.emit();
    this.hide();
  }

  /** close modal */
  hide() {
    this.modal.close();
  }

  /** open modal */
  show() {
    return this.modalTemplate;
  }
}
