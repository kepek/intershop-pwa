import { ChangeDetectionStrategy, Component, Input, TemplateRef, ViewChild } from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

import { EditRequisition, Requisition } from '../../../models/requisition/requisition.model';

@Component({
  selector: 'camfil-edit-approval-details-modal',
  templateUrl: './edit-approval-details-modal.component.html',
  styleUrls: ['./edit-approval-details-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditApprovalDetailsModalComponent {
  @Input() requisition: Requisition;
  modal: NgbModalRef;
  @ViewChild('modal', { static: false }) modalTemplate: TemplateRef<unknown>;

  approvalDetails: EditRequisition;

  constructor() {}

  convertToFormValues() {
    return {
      ...this.requisition,
      basket: this.requisition.id,
      customerId: this.requisition.customerNo ? this.requisition.customerNo : '',
      invoiceLabel: '',
      phoneNumber: '',
      orderMark: '',
      deliveryAddressId: this.requisition.commonShipToAddress.id,
      company: this.requisition.commonShipToAddress ? this.requisition.commonShipToAddress.companyName1 : '',
      address: this.requisition.commonShipToAddress ? this.requisition.commonShipToAddress.addressLine1 : '',
      zipCode: this.requisition.commonShipToAddress ? this.requisition.commonShipToAddress.postalCode : '',
      area: this.requisition.commonShipToAddress ? this.requisition.commonShipToAddress.city : '',
      info: '',
    };
  }

  hide() {
    this.modal.close();
  }

  show() {
    this.approvalDetails = this.convertToFormValues();
    return this.modalTemplate;
  }
}
