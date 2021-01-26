import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { AddressHelper } from 'ish-core/models/address/address.helper';
import { Address } from 'ish-core/models/address/address.model';
import { BasketExtensions } from 'ish-core/models/basket/basket.interface';
import { BasketView } from 'ish-core/models/basket/basket.model';
import { Bucket } from 'ish-core/models/basket/bucket.model';
import { Product } from 'ish-core/models/product/product.model';
import { whenTruthy } from 'ish-core/utils/operators';
import { markAsDirtyRecursive } from 'ish-shared/forms/utils/form-utils';

import { CamCardContact } from '../../../models/cam-card/cam-card.model';

import { OrderFormComponent } from './order-form/order-form.component';

@Component({
  selector: 'camfil-create-order-modal',
  templateUrl: './create-order-modal.component.html',
  styleUrls: ['./create-order-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateOrderModalComponent implements OnInit, OnDestroy {
  constructor(
    private fb: FormBuilder,
    private shoppingFacade: ShoppingFacade,
    private checkoutFacade: CheckoutFacade
  ) {}

  /**
   * Callback function to hide modal dialog (used with ishServerHtml). - is needed for closing the dialog after the user clicks a message link
   */
  get callbackHideDialogModal() {
    return () => {
      this.hide();
    };
  }

  @Input() product?: Product;

  @Output() createEmitter = new EventEmitter<Bucket>();

  modal: NgbModalRef;
  @ViewChild('modal', { static: false }) modalTemplate: TemplateRef<unknown>;

  @ViewChild(OrderFormComponent) orderFormCmp: OrderFormComponent;

  orderForm: FormGroup;
  quantityForm: FormGroup;

  private destroy$ = new Subject<void>();

  showSuccess = false;

  basket$: Observable<BasketView>;
  basketId: string;
  commonShippingMethodId: string;

  @Input() order?: Bucket;
  @Input() edit = false;

  contacts: CamCardContact[];
  basketAddresses: Address[];

  ngOnInit() {
    this.initForms();
    this.initBasket();
  }

  initForms() {
    this.orderForm = this.fb.group({});
    this.quantityForm = new FormGroup({
      quantity: new FormControl(this.product?.minOrderQuantity),
      boxLabel: new FormControl('', Validators.maxLength(60)),
    });
  }

  initBasket() {
    this.basket$ = this.checkoutFacade.basket$;
    this.basket$.pipe(whenTruthy(), takeUntil(this.destroy$)).subscribe((basket: BasketView) => {
      this.basketId = basket.id;
      this.commonShippingMethodId = basket.commonShippingMethod?.id;
    });

    this.shoppingFacade.basketAddresses$.pipe(takeUntil(this.destroy$)).subscribe((basketAddresses: Address[]) => {
      this.basketAddresses = basketAddresses;
    });

    this.shoppingFacade.productUpdated$.pipe(whenTruthy(), takeUntil(this.destroy$)).subscribe(() => {
      this.showSuccess = true;
    });
  }

  submitForm() {
    const addressForm = this.orderFormCmp.addressForm;

    if (addressForm.invalid || this.quantityForm.invalid) {
      markAsDirtyRecursive(addressForm);
      markAsDirtyRecursive(this.quantityForm);
    } else {
      const bucket: Bucket = {
        basket: '',
        id: '',
        ...this.getBasketExtension(),
        shippingAddress: this.getAddress(),
      };
      this.product ? this.addProductToBucket() : this.createEmitter.emit(bucket);
    }
  }

  addProductToBucket() {
    const address = this.getAddress();
    const quantity = this.quantityForm.get('quantity').value;

    if (this.isNewAddress()) {
      this.shoppingFacade.addProductToBucket(
        address,
        this.commonShippingMethodId,
        this.product.sku,
        quantity,
        this.basketId,
        this.getBasketExtension()
      );
    } else {
      this.shoppingFacade.addProductToBucketWithUrn(
        this.getUrn(address),
        this.commonShippingMethodId,
        this.orderFormCmp.addressForm.get('addressFull').value.id,
        this.product.sku,
        quantity,
        this.basketId,
        this.getBasketExtension()
      );
    }
  }

  getAddress(): Address {
    const addressForm = this.orderFormCmp.addressForm;
    const contact = addressForm.get('contactFull').value;

    return {
      addressName: '',
      country: '',
      firstName: contact.firstName,
      id: '',
      invoiceToAddress: true,
      lastName: contact.lastName,
      phoneHome: '',
      shipToAddress: true,
      urn: '',
      addressLine1: addressForm.get('address').value,
      addressLine2: addressForm.get('building').value,
      postalCode: addressForm.get('zipCode').value,
      city: addressForm.get('area').value,
      companyName1: addressForm.get('company').value,
      countryCode: 'SE',
      eligibleShipToAddress: true,
    };
  }

  getUrn(currentAddress: Address): string {
    return AddressHelper.getUrn(currentAddress, this.basketAddresses);
  }

  isNewAddress() {
    const currentAddress = this.getAddress();
    return AddressHelper.isNewAddress(currentAddress, this.basketAddresses);
  }

  getBasketExtension(): BasketExtensions {
    const addressForm = this.orderFormCmp.addressForm;

    return {
      customer: {
        id: addressForm.get('customer').value,
        customerNo: addressForm.get('customer').value,
      },
      contactPerson: addressForm.get('contactFull').value,
      orderMark: addressForm.get('orderMark').value,
      invoiceLabel: addressForm.get('invoiceLabel').value,
      phoneNumber: addressForm.get('phoneNumber').value,
      info: addressForm.get('info').value,
      boxLabel: this.quantityForm.get('boxLabel').value,
    };
  }

  cancel() {
    this.hide();
  }

  /** close modal */
  hide() {
    this.modal.close();
  }

  /** open modal */
  show() {
    this.showSuccess = false;
    return this.modalTemplate;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
