import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { User } from '@sentry/browser';

import { CamfilToastrService } from 'ish-core/store/core/messages/CamfilToastrService';

import { CamRequisitionManagementFacade } from '../../facades/cam-requisition-management.facade';
import { CamfilRequisitionHelper } from '../../models/camfil-requisition/camfil-requisition.helper';
import { CamfilRequisition, CamfilRequisitionViewer } from '../../models/camfil-requisition/camfil-requisition.model';

import { EditApprovalDetailsModalComponent } from './edit-approval-details-modal/edit-approval-details-modal.component';

@Component({
  selector: 'camfil-requisition-summary',
  templateUrl: './camfil-requisition-summary.component.html',
  styleUrls: ['./camfil-requisition-summary.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilRequisitionSummaryComponent implements OnInit {
  @Input() requisition: CamfilRequisition;
  @Input() user: User;
  @Input() userPermissions: string[];
  @Input() view: CamfilRequisitionViewer = 'buyer';

  customerNoteForm: FormGroup;
  getIsCamfilRequisitionEditable = CamfilRequisitionHelper.getIsCamfilRequisitionEditable;
  getIsCamfilRequisitionApproved = CamfilRequisitionHelper.getIsCamfilRequisitionApproved;
  getIsCamfilRequisitionRejected = CamfilRequisitionHelper.getIsCamfilRequisitionRejected;

  constructor(
    public dialog: MatDialog,
    private toast: CamfilToastrService,
    private translate: TranslateService,
    private camRequisitionManagementFacade: CamRequisitionManagementFacade
  ) {}

  get isEditable(): boolean {
    const { approval } = this.requisition;
    return this.getIsCamfilRequisitionEditable(approval);
  }

  get isRequisitionApproved(): boolean {
    const { approval } = this.requisition;
    return this.getIsCamfilRequisitionApproved(approval);
  }

  get isRequisitionRejected(): boolean {
    const { approval } = this.requisition;
    return this.getIsCamfilRequisitionRejected(approval);
  }

  ngOnInit() {
    this.customerNoteForm = new FormGroup({
      customerNote: new FormControl(this.requisition.userComment),
    });
  }

  onBlur(target: HTMLDataElement) {
    if (this.canEditRequisition()) {
      const customerNoteValue = target.value;
      const updatedRequisition = {
        ...this.requisition,
        userComment: customerNoteValue,
      };
      this.camRequisitionManagementFacade.updateCamfilRequisition(updatedRequisition);
    } else {
      this.toast.error(this.translate.instant('camfil.approval.detailspage.edit.permission_denied.text'), '', {
        timeOut: 3000,
      });
      return;
    }
  }

  canEditRequisition() {
    return (
      (this.userPermissions?.includes('APP_B2B_APPROVE') || this.requisition?.user.login === this.user?.login) &&
      this.getIsCamfilRequisitionEditable(this.requisition?.approval)
    );
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
