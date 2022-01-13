import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { User } from '@sentry/browser';

import { CamfilToastrService } from 'ish-core/store/core/messages/CamfilToastrService';

import { CamRequisitionManagementFacade } from '../../facades/cam-requisition-management.facade';
import { Requisition, RequisitionViewer } from '../../models/requisition/requisition.model';

import { EditApprovalDetailsModalComponent } from './edit-approval-details-modal/edit-approval-details-modal.component';

@Component({
  selector: 'camfil-requisition-summary',
  templateUrl: './camfil-requisition-summary.component.html',
  styleUrls: ['./camfil-requisition-summary.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilRequisitionSummaryComponent implements OnInit {
  @Input() requisition: Requisition;
  @Input() user: User;
  @Input() userPermissions: string[];
  @Input() view: RequisitionViewer = 'buyer';
  private camRequisitionManagementFacade: CamRequisitionManagementFacade;
  customerNoteForm: FormGroup;

  constructor(public dialog: MatDialog, private toast: CamfilToastrService, private translate: TranslateService) {}

  ngOnInit() {
    this.customerNoteForm = new FormGroup({
      customerNote: new FormControl(''),
    });
  }

  onBlur(target: HTMLDataElement) {
    const customerNoteValue = target.value;
    const updatedRequisition = {
      ...this.requisition,
      basketExtensions: {
        ...this.requisition.basketExtensions,
        info: customerNoteValue,
      },
    };
    this.camRequisitionManagementFacade?.updateRequisition(updatedRequisition);
  }

  canEditRequisition() {
    return this.userPermissions.includes('APP_B2B_APPROVE') || this.requisition?.user.login === this.user?.login;
  }

  openEditApprovalDetailsModal(modal: EditApprovalDetailsModalComponent) {
    if (this.canEditRequisition()) {
      this.dialog.open(modal.show());
      modal.hide = () => this.dialog.closeAll();
    } else {
      this.toast.error(this.translate.instant('camfil.approval.detailspage.edit.permission_denied.text'), '', {
        timeOut: 3000,
      });
      return;
    }
  }
}
