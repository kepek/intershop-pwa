import { ChangeDetectionStrategy, Component, Input, TemplateRef, ViewChild } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { OrderFormComponent } from 'src/app/extensions/cam-cards/shared/add-product-to-cart-modal/create-order-product-modal/order-form/order-form.component';

import { Address } from 'ish-core/models/address/address.model';
import { markAsDirtyRecursive } from 'ish-shared/forms/utils/form-utils';

import { CamRequisitionManagementFacade } from '../../../facades/cam-requisition-management.facade';
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
  @ViewChild(OrderFormComponent) orderForm: OrderFormComponent;

  @ViewChild('secondaryButton') secondaryButton: MatButton;
  @ViewChild('primaryButton') primaryButton: MatButton;

  approvalDetails: EditRequisition;

  constructor(private camRequisitionManagementFacade: CamRequisitionManagementFacade) {}

  convertToFormValues() {
    return {
      ...this.requisition,
      basket: this.requisition.id,
      customerId: this.requisition.requisitionCustomer ? this.requisition.requisitionCustomer.id : '',
      invoiceLabel: this.requisition.invoiceLabel,
      phoneNumber: this.requisition.phoneNumber,
      orderMark: this.requisition.orderMark,
      deliveryAddressId: this.requisition.shippingAddress.id,
      company: this.requisition.shippingAddress ? this.requisition.shippingAddress.companyName1 : '',
      address: this.requisition.shippingAddress ? this.requisition.shippingAddress.addressLine1 : '',
      zipCode: this.requisition.shippingAddress ? this.requisition.shippingAddress.postalCode : '',
      area: this.requisition.shippingAddress ? this.requisition.shippingAddress.city : '',
      info: this.requisition.info,
    };
  }

  hide() {
    this.modal.close();
  }

  show() {
    this.approvalDetails = this.convertToFormValues();
    return this.modalTemplate;
  }

  submitEdit() {
    const addressForm = this.orderForm.addressForm;

    if (addressForm.invalid) {
      markAsDirtyRecursive(addressForm);
    } else {
      const address = this.getUpdatedAddress();

      const form = this.orderForm.addressForm;

      const requisition = {
        ...this.requisition,
        contactPerson: form.get('contactFull').value,
        shipToAddressFull: address,
        orderMark: form.get('orderMark').value,
        invoiceLabel: form.get('invoiceLabel').value,
        info: form.get('info').value,
        phoneNumber: form.get('phoneNumber').value,
      };

      this.camRequisitionManagementFacade.updateRequisition(requisition);
      this.hide();
    }
  }

  getUpdatedAddress(): Address {
    const form = this.orderForm.addressForm;
    const contact = form.get('contactFull').value;

    return {
      ...this.requisition.shippingAddress,
      firstName: contact?.firstName || this.requisition.shippingAddress.firstName,
      lastName: contact?.lastName || this.requisition.shippingAddress.lastName,
      addressLine1: form.get('address').value,
      addressLine2: form.get('addressLine2')?.value || '',
      postalCode: form.get('zipCode').value,
      city: form.get('area').value,
      companyName1: form.get('company').value,
    };
  }
}
