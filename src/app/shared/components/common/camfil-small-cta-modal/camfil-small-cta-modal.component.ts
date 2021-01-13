import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, TemplateRef, ViewChild } from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'camfil-small-cta-modal',
  templateUrl: './camfil-small-cta-modal.component.html',
  styleUrls: ['./camfil-small-cta-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilSmallCtaModalComponent {
  modal: NgbModalRef;

  @ViewChild('modal', { static: false }) modalTemplate: TemplateRef<unknown>;

  @Input() actionTemplate?: TemplateRef<any>;
  @Input() actionTitle?: string;
  @Input() actionButtonTitle?: string;
  @Input() action2ButtonTitle?: string;
  @Output() actionClicked = new EventEmitter<any>();
  @Output() action2Clicked = new EventEmitter<any>();
  @Input() showCloseIcon = false;
  @Input() onlyAccept = false;
  @Input() hasError = false;
  @Input() icon?: string;

  emitAction() {
    this.actionClicked.emit();
    this.hide();
  }

  emitAction2() {
    this.action2Clicked.emit();
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

  /**
   * Callback function to hide modal dialog (used with ishServerHtml). - is needed for closing the dialog after the user clicks a message link
   */
  get callbackHideDialogModal() {
    return () => {
      this.hide();
    };
  }
}
