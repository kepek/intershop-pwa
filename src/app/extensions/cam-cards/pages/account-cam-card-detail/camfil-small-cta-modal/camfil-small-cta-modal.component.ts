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
