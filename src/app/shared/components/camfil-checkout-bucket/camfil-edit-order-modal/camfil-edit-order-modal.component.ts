import { ChangeDetectionStrategy, Component, Input, OnDestroy, TemplateRef, ViewChild } from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { Address } from 'ish-core/models/address/address.model';
import { BasketExtension } from 'ish-core/models/basket-extension/basket-extension.model';
import { BucketHelper } from 'ish-core/models/bucket/bucket.helper';
import { Bucket, EditBucket } from 'ish-core/models/bucket/bucket.model';
import { markAsDirtyRecursive } from 'ish-shared/forms/utils/form-utils';

import { OrderFormComponent } from '../../../../extensions/cam-cards/shared/add-product-to-cart-modal/create-order-product-modal/order-form/order-form.component';

@Component({
  selector: 'camfil-edit-order-modal',
  templateUrl: './camfil-edit-order-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilEditOrderModalComponent implements OnDestroy {
  modal: NgbModalRef;
  @ViewChild('modal', { static: false }) modalTemplate: TemplateRef<unknown>;

  private destroy$ = new Subject<void>();

  @Input() bucket?: Bucket;
  editOrder: EditBucket;

  @ViewChild(OrderFormComponent) orderForm: OrderFormComponent;

  // @ts-ignore
  constructor(private shoppingFacade: ShoppingFacade, private checkoutFacade: CheckoutFacade) {}

  convertToFormValues() {
    return {
      ...this.bucket,
      customerId: this.bucket.customer ? this.bucket.customer.id : '',
      invoiceLabel: this.bucket.invoiceLabel,
      phoneNumber: this.bucket.phoneNumber,
      orderMark: this.bucket.orderMark,
      deliveryAddressId: this.bucket.deliveryAddressId,
      company: this.bucket.shipToAddressFull ? this.bucket.shipToAddressFull.companyName1 : '',
      addressLine1: this.bucket.shipToAddressFull ? this.bucket.shipToAddressFull.addressLine1 : '',
      addressLine2: this.bucket.shipToAddressFull ? this.bucket.shipToAddressFull?.addressLine2 || '' : '',
      zipCode: this.bucket.shipToAddressFull ? this.bucket.shipToAddressFull.postalCode : '',
      area: this.bucket.shipToAddressFull ? this.bucket.shipToAddressFull.city : '',
      info: this.bucket.info,
    };
  }

  submitEdit() {
    const addressForm = this.orderForm.addressForm;

    if (addressForm.invalid) {
      markAsDirtyRecursive(addressForm);
    } else {
      const basketExtension = this.getUpdatedBasketExtension();
      const shipToAddressFull = this.getUpdatedAddress();

      const bucket = {
        ...this.bucket,
        contactPerson: addressForm.get('contactFull').value || this.bucket.contactPerson,
        orderMark: addressForm.get('orderMark').value,
        invoiceLabel: addressForm.get('invoiceLabel').value,
        info: addressForm.get('info').value,
        phoneNumber: addressForm.get('phoneNumber').value,
        shipToAddressFull,
      };

      BucketHelper.isEmptyBucket(bucket)
        ? this.checkoutFacade.updateEmptyBucket(bucket)
        : this.shoppingFacade.updateBucket(
            this.editOrder.basket,
            this.editOrder.shipToAddressFull.id,
            basketExtension,
            shipToAddressFull
          );

      this.additionalActionOnSubmit();
      this.hide();
    }
  }

  /**
   * used in parent component as extra action onSubmit
   * DO NOT REMOVE
   */
  additionalActionOnSubmit() {}

  getUpdatedBasketExtension(): BasketExtension {
    const form = this.orderForm.addressForm;
    const customer = this.orderForm.addressForm.get('customerFull').value;

    return {
      ...this.bucket,
      customer: {
        id: customer.id,
        customerNo: customer.customerNo,
        companyName: customer.companyName,
      },
      orderMark: form.get('orderMark').value,
      invoiceLabel: form.get('invoiceLabel').value,
      contactPerson: form.get('contactFull').value || this.bucket.contactPerson,
      info: form.get('info').value,
      phoneNumber: form.get('phoneNumber').value,
    };
  }

  getUpdatedAddress(): Address {
    const form = this.orderForm.addressForm;
    const contact = form.get('contactFull').value;

    return {
      ...this.bucket.shipToAddressFull,
      firstName: contact?.firstName || this.bucket.shipToAddressFull.firstName,
      lastName: contact?.lastName || this.bucket.shipToAddressFull.lastName,
      addressLine1: form.get('addressLine1').value,
      addressLine2: form.get('addressLine2')?.value || '',
      postalCode: form.get('zipCode').value,
      city: form.get('area').value,
      companyName1: form.get('company').value,
      goodsAcceptanceNote: form.get('goodsAcceptanceNote').value || '',
    };
  }

  /** close modal */
  hide() {
    this.modal.close();
  }

  /** open modal */
  show() {
    this.editOrder = this.convertToFormValues();
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
