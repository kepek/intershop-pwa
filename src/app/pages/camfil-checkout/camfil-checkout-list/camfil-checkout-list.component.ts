import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

import { Price } from 'ish-core/models/price/price.model';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Bucket } from 'ish-core/models/basket/bucket.model';
import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { LineItem } from 'ish-core/models/line-item/line-item.model';
import { LineItemData } from 'ish-core/models/line-item/line-item.interface';

import { ModalAddNewProductComponent } from '../../../extensions/cam-cards/pages/account-cam-card-detail/modal-add-new-product/modal-add-new-product.component';

@Component({
  selector: 'camfil-checkout-list',
  templateUrl: './camfil-checkout-list.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./camfil-checkout-list.component.scss'],
})
export class CamfilCheckoutListComponent {
  @Input() order;
  @Input() buckets;
  isOrderOpen = true;
  orderForm: FormGroup;

  constructor(private fb: FormBuilder, public dialog: MatDialog, private checkoutFacade: CheckoutFacade) {

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
  sortBy() {
    const items: LineItemData[] = Object.keys(this.order.lineItems).map(i => this.order.lineItems[i]);

    return items.sort((a, b) => (a.position < b.position ? -1 : 1));
  }

  getTargetPosition(previousIndex, currentIndex, items) {
    // sort first because currentIndex contains only the 'visible' position
    items.sort((a, b) => (a.position < b.position ? -1 : 1));
    let predecessorPos;
    let successorPos;
    let targetPos;

    if (previousIndex === undefined || previousIndex > currentIndex) {
      /** moving line item upwards */
      predecessorPos = items[currentIndex - 1]?.position;
      successorPos = items[currentIndex]?.position;
    } else {
      /** moving line item downwards */
      predecessorPos = items[currentIndex]?.position;
      successorPos = items[currentIndex + 1]?.position;
    }

    if (predecessorPos === undefined && successorPos === undefined) {
      return; // Current position
    } else if (predecessorPos === undefined) {
      targetPos = successorPos; //Successor position - update all succesors
    } else if (successorPos === undefined) {
      targetPos = predecessorPos; //Predecesor position
    } else {
      const gap = successorPos - predecessorPos;

      if (gap <= 2) {
        // this.checkoutFacade.camfilResetItemPositions(targetOrder);
      }
      targetPos = Math.round(gap / 2) + predecessorPos;
    }
    // skip 0
    return targetPos ? targetPos : 1;
  }

  camfilDragLineItem(lineItem: LineItem, targetBucket: Bucket, position: number) {
    const basketId = targetBucket.basket;
    const updatedLineItem = {
      ...lineItem,
      position: position,
    };
    this.checkoutFacade.camfilDragLineItem(basketId, updatedLineItem, targetBucket);
  }

  drop(event: CdkDragDrop<string[]>, targetOrder: Bucket) {
    if (event.previousContainer === event.container) {
      // same position, do nothing
      if (event.previousIndex === event.currentIndex) {
        return;
      }
      const items: LineItemData[] = Object.keys(event.container.data).map(i => event.container.data[i]);
      const targetPos = this.getTargetPosition(event.previousIndex, event.currentIndex, items);
      this.camfilDragLineItem(event.item.data, targetOrder, targetPos);
    } else {
      //Move line item to different bucket
      let items: LineItemData[] = Object.keys(event.container.data).map(i => event.container.data[i]);
      const targetPos = this.getTargetPosition(event.previousIndex, event.currentIndex, items);
      this.camfilDragLineItem(event.item.data, targetOrder, targetPos);
    }
  }
}
