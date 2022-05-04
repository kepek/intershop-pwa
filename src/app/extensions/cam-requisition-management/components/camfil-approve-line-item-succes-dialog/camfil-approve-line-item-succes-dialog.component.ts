import { ChangeDetectionStrategy, Component, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'camfil-approve-line-item-succes-dialog',
  templateUrl: './camfil-approve-line-item-succes-dialog.component.html',
  styleUrls: ['./camfil-approve-line-item-succes-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilApproveLineItemSuccesDialogComponent {
  modal: NgbModalRef;

  @ViewChild('modal') modalTemplate: TemplateRef<unknown>;
  constructor(private ngbModal: NgbModal, private router: Router) {}

  show() {
    this.modal = this.ngbModal.open(this.modalTemplate);
  }

  hide() {
    if (this.modal) {
      this.modal.close();
    }
  }

  goToOrderHistoryPage() {
    this.router.navigate(['/orders']);
    this.hide();
  }
}
