import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { Address } from 'ish-core/models/address/address.model';
import { BasketExtensions } from 'ish-core/models/basket/basket.interface';
import { Bucket, EditBucket } from 'ish-core/models/basket/bucket.model';
import { markAsDirtyRecursive } from 'ish-shared/forms/utils/form-utils';

import { OrderFormComponent } from '../../../../extensions/cam-cards/shared/add-to-cart-modal/create-order-modal/order-form/order-form.component';

@Component({
  selector: 'camfil-edit-order-modal',
  templateUrl: './edit-order-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditOrderModalComponent implements OnInit, OnDestroy {
  modal: NgbModalRef;
  @ViewChild('modal', { static: false }) modalTemplate: TemplateRef<unknown>;

  private destroy$ = new Subject<void>();

  @Input() order?: Bucket;
  editOrder: EditBucket;

  @ViewChild(OrderFormComponent) orderForm: OrderFormComponent;

  // @ts-ignore
  constructor(private shoppingFacade: ShoppingFacade) {}

  ngOnInit() {
    this.editOrder = this.convertToFormValues();
  }

  convertToFormValues() {
    return {
      ...this.order,
      customerId: this.order.customer ? this.order.customer.id : '',
      invoiceLabel: this.order.invoiceLabel,
      phoneNumber: this.order.phoneNumber,
      orderMark: this.order.orderMark,
      deliveryAddressId: this.order.deliveryAddressId,
      company: this.order.shipToAddressFull ? this.order.shipToAddressFull.companyName1 : '',
      building: this.order.shipToAddressFull ? this.order.shipToAddressFull.addressLine2 : '',
      address: this.order.shipToAddressFull ? this.order.shipToAddressFull.addressLine1 : '',
      zipCode: this.order.shipToAddressFull ? this.order.shipToAddressFull.postalCode : '',
      area: this.order.shipToAddressFull ? this.order.shipToAddressFull.city : '',
      info: this.order.info,
    };
  }

  submitEdit() {
    const addressForm = this.orderForm.addressForm;

    if (addressForm.invalid) {
      markAsDirtyRecursive(addressForm);
    } else {
      const basketExtension = this.getUpdatedBasketExtension();
      const address = this.getUpdatedAddress();

      this.shoppingFacade.updateBucket(
        this.editOrder.basket,
        this.editOrder.shipToAddressFull.id,
        basketExtension,
        address
      );
      this.hide();
    }
  }

  getUpdatedBasketExtension(): BasketExtensions {
    const form = this.orderForm.addressForm;

    return {
      ...this.order,
      orderMark: form.get('orderMark').value,
      invoiceLabel: form.get('invoiceLabel').value,
      contactPerson: form.get('contactFull').value || this.order.contactPerson,
      info: form.get('info').value,
      phoneNumber: form.get('phoneNumber').value,
    };
  }

  getUpdatedAddress(): Address {
    const form = this.orderForm.addressForm;
    const contact = form.get('contactFull').value;

    return {
      ...this.order.shipToAddressFull,
      firstName: contact?.firstName || this.order.shipToAddressFull.firstName,
      lastName: contact?.lastName || this.order.shipToAddressFull.lastName,
      addressLine1: form.get('address').value,
      addressLine2: form.get('building').value,
      postalCode: form.get('zipCode').value,
      city: form.get('area').value,
      companyName1: form.get('company').value,
    };
  }

  /** close modal */
  hide() {
    this.modal.close();
  }

  /** open modal */
  show() {
    return this.modalTemplate;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
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
