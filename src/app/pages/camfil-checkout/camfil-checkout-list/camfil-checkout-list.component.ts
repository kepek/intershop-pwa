import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { Price } from 'ish-core/models/price/price.model';

import { ModalAddNewProductComponent } from '../../../extensions/cam-cards/pages/account-cam-card-detail/modal-add-new-product/modal-add-new-product.component';

@Component({
  selector: 'camfil-checkout-list',
  templateUrl: './camfil-checkout-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./camfil-checkout-list.component.scss'],
})
export class CamfilCheckoutListComponent {
  @Input() order;
  isOrderOpen = true;
  orderForm: FormGroup;

  constructor(private fb: FormBuilder, public dialog: MatDialog) {
    this.initForm();
  }

  initForm() {
    this.orderForm = this.fb.group({
      orderMark: ['', [Validators.required, Validators.maxLength(35)]],
      invoiceMark: ['', [Validators.maxLength(35)]],
      deliveryDate: ['', [Validators.maxLength(35)]],
      note: ['', [Validators.maxLength(35)]],
    });
  }

  toggleOrder() {
    this.isOrderOpen = !this.isOrderOpen;
  }

  totalPrice(): Price {
    const price: Price = {
      type: 'Money',
      currency: 'USD',
      value: 0,
    };

    const items = this.order && this.order.lineItems;

    if (items) {
      items.forEach(element => {
        price.currency = element.price.currency;
        price.value = price.value + element.totals?.total.gross;
      });
    }

    return price;
  }

  totalTax(): Price {
    const price: Price = {
      type: 'Money',
      currency: 'USD',
      value: 0,
    };

    const items = this.order && this.order.lineItems;

    if (items) {
      items.map(element => {
        price.currency = element.totals?.salesTaxTotal.currency;
        price.value = price.value + element.totals?.salesTaxTotal.value;
      });
    }
    return price;
  }

  discount(): Price {
    const price: Price = {
      type: 'Money',
      currency: 'USD',
      value: 0,
    };

    const items = this.order && this.order.lineItems;

    if (items) {
      items.map(element => {
        price.currency = element.price.currency;
        price.value = price.value + (element.totals?.total.gross - element.totals?.undiscountedTotal.gross);
      });
    }

    return price;
  }

  openAddToProductModal(modal: ModalAddNewProductComponent) {
    this.dialog.open(modal.show());
    modal.hide = () => this.dialog.closeAll();
  }
}
