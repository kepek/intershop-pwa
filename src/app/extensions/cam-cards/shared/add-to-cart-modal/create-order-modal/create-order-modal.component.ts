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
import { BasketView } from 'ish-core/models/basket/basket.model';
import { Bucket } from 'ish-core/models/basket/bucket.model';
import { Product } from 'ish-core/models/product/product.model';
import { markAsDirtyRecursive } from 'ish-shared/forms/utils/form-utils';

import { CamCardsFacade } from '../../../facades/cam-cards.facade';
import { CamCard } from '../../../models/cam-card/cam-card.model';

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
    private camCardsFacade: CamCardsFacade,
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

  @Output() createEmitter = new EventEmitter<CamCard>();

  modal: NgbModalRef;
  @ViewChild('modal', { static: false }) modalTemplate: TemplateRef<unknown>;

  @ViewChild(OrderFormComponent) deliveryAddress: OrderFormComponent;

  orderForm: FormGroup;
  quantityForm: FormGroup;

  virtualCamCard$: Observable<CamCard>;
  currentVirtualCamCard: CamCard;

  private destroy$ = new Subject<void>();

  missingAddressFields = {
    id: '',
    urn: '',
    addressName: '',
    firstName: '',
    lastName: '',
    country: '',
    countryCode: '',
    phoneHome: '',
    invoiceToAddress: true,
    shipToAddress: true,
  };

  showSuccess = false;
  updated = false;

  basket$: Observable<BasketView>;
  basketId: string;

  @Input() order?: Bucket;
  @Input() edit = false;

  ngOnInit() {
    this.updated = false;

    this.orderForm = this.fb.group({});
    this.quantityForm = new FormGroup({
      quantity: new FormControl(this.product?.minOrderQuantity),
      boxLabel: new FormControl('', Validators.maxLength(60)),
    });

    this.virtualCamCard$ = this.camCardsFacade.virtualCamCard$;
    this.basket$ = this.checkoutFacade.basket$;
    this.camCardsFacade.clearVirtualCamCard();

    this.subscribeToStateChanges();
  }

  subscribeToStateChanges() {
    this.virtualCamCard$.pipe(takeUntil(this.destroy$)).subscribe((virtualCamCard: CamCard) => {
      if (virtualCamCard) {
        this.product ? this.addToBasket(virtualCamCard.deliveryAddress.urn) : this.createEmitter.emit(virtualCamCard);
      }
      this.currentVirtualCamCard = virtualCamCard;
    });

    this.shoppingFacade.productAdded$.pipe(takeUntil(this.destroy$)).subscribe((productAdded: boolean) => {
      this.handleSuccess(productAdded);
    });

    this.basket$.pipe(takeUntil(this.destroy$)).subscribe((basket: BasketView) => {
      if (basket) {
        this.basketId = basket.id;
      }
    });
  }

  handleSuccess(productAdded: boolean) {
    if (productAdded) {
      if (!this.updated) {
        this.updated = true;
        this.shoppingFacade.resetProductAdded();
        this.updateBucketValues();
      } else {
        this.showSuccess = true;
      }
    }
  }

  updateBucketValues() {
    const boxLabel = this.quantityForm.get('boxLabel').value;

    if (this.deliveryAddress && this.deliveryAddress.addressForm.valid) {
      const contact = this.deliveryAddress.addressForm.get('contact').value;
      const info = this.deliveryAddress.addressForm.get('info').value;
      const phoneNumber = this.deliveryAddress.addressForm.get('phoneNumber').value;

      this.shoppingFacade.updateBucket(
        this.basketId,
        this.currentVirtualCamCard.deliveryAddress.id,
        boxLabel,
        contact,
        info,
        phoneNumber
      );
    }
  }

  addToBasket(shipToAddress?: string) {
    if (this.quantityForm.valid) {
      const quantity = this.quantityForm.get('quantity').value;
      this.shoppingFacade.addProductToBasket(this.product.sku, quantity, shipToAddress);
    } else {
      markAsDirtyRecursive(this.quantityForm);
    }
  }

  submitForm() {
    const addressForm = this.deliveryAddress.addressForm;

    if (addressForm.invalid) {
      markAsDirtyRecursive(addressForm);
    } else {
      this.createVirtualCamCard();
    }
  }

  createVirtualCamCard() {
    const virtualCamCardData = this.createVirtualCamCardData();

    this.camCardsFacade.createVirtualCamCard(virtualCamCardData);
  }

  createVirtualCamCardData(): CamCard {
    const addressForm = this.deliveryAddress.addressForm;

    return {
      name: 'virtual camCard',
      orderLabel: addressForm.get('orderMark').value,
      invoiceLabel: addressForm.get('invoiceLabel').value,
      customer: {
        id: addressForm.get('customer').value,
        customerNo: addressForm.get('customer').value,
      },
      deliveryAddress: {
        ...this.missingAddressFields,
        addressLine1: addressForm.get('address').value,
        street: addressForm.get('address').value,
        addressLine2: addressForm.get('building').value,
        postalCode: addressForm.get('zipCode').value,
        city: addressForm.get('area').value,
        companyName1: addressForm.get('company').value,
      },
      transient: true,
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
