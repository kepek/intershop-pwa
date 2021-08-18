import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Observable, Subject } from 'rxjs';
import { debounceTime, take, takeUntil } from 'rxjs/operators';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { AttributeHelper } from 'ish-core/models/attribute/attribute.helper';
import { Attribute } from 'ish-core/models/attribute/attribute.model';
import { LineItemUpdate } from 'ish-core/models/line-item-update/line-item-update.model';
import { LineItem, LineItemView } from 'ish-core/models/line-item/line-item.model';
import { ProductViewHelper } from 'ish-core/models/product-view/product-view.helper';
import { ProductView } from 'ish-core/models/product-view/product-view.model';
import { ProductCompletenessLevel } from 'ish-core/models/product/product.model';
import { CheckoutFocusedElement } from 'ish-core/models/scroll-info copy/checkout-focused-element.interface';
import { whenTruthy } from 'ish-core/utils/operators';
import { CamfilQuickViewModalComponent } from 'ish-shared/components/common/camfil-quick-view-modal/camfil-quick-view-modal.component';
import { CamfilSmallCtaModalComponent } from 'ish-shared/components/common/camfil-small-cta-modal/camfil-small-cta-modal.component';
import { markAsDirtyRecursive } from 'ish-shared/forms/utils/form-utils';

import { CamCardMeasurement } from '../../../extensions/cam-cards/models/cam-card/cam-card.model';

@Component({
  selector: 'camfil-checkout-line-item',
  templateUrl: './camfil-checkout-line-item.component.html',
  styleUrls: ['./camfil-checkout-line-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilCheckoutLineItemComponent implements OnChanges, OnInit, OnDestroy {
  constructor(
    private shoppingFacade: ShoppingFacade,
    private checkoutFacade: CheckoutFacade,
    public dialog: MatDialog
  ) { }

  private static REQUIRED_COMPLETENESS_LEVEL = ProductCompletenessLevel.List;

  @ViewChild(CamfilSmallCtaModalComponent) modal: CamfilSmallCtaModalComponent;
  @ViewChild('autosize') autosize: CdkTextareaAutosize;
  @Input() selectedItemsForm?: FormArray;
  @Input() index: number;
  @Input() basketId: string;
  @Input() bucketId: string;
  @Input() orderDeliveryDate: string;
  @Input() isPartialDelivery: boolean;
  @Input() focusedCheckoutElement: CheckoutFocusedElement;
  @Input() focusedElement: CheckoutFocusedElement;
  @Input() focusedElementId: string;
  @Input() isConfirmed;
  @Input() lineItem: LineItemView;

  earliestDeliveryDate: string;
  quantity = 0;
  boxLabel: string;
  measurementsValues = ['width', 'height', 'diameter'];
  measurements: CamCardMeasurement;
  attrsValidator = {
    boxLabel: [{ error: 'maxlength', message: 'MAX length exceeded' }],
  };

  product$: Observable<ProductView>;
  product: ProductView;

  private destroy$ = new Subject<void>();

  addToCartForm: FormGroup;
  boxLabelForm: FormGroup;

  ngOnInit() {
    this.product$ = this.shoppingFacade.product$(
      this.lineItem.productSKU,
      CamfilCheckoutLineItemComponent.REQUIRED_COMPLETENESS_LEVEL
    );

    this.checkoutFacade.basketLineItems$?.pipe(whenTruthy(), take(1)).subscribe((res: LineItem[]) => {
      this.boxLabel = (this.getValFromAttrs(res, 'boxLabel') as string) || '';
      this.measurements = {
        [this.measurementsValues[0]]: (this.getValFromAttrs(res, 'width') as number) || undefined,
        [this.measurementsValues[1]]: (this.getValFromAttrs(res, 'height') as number) || undefined,
        [this.measurementsValues[2]]: (this.getValFromAttrs(res, 'diameter') as number) || undefined,
      };
    });

    this.addToCartForm = new FormGroup({
      quantity: new FormControl(this.lineItem?.quantity?.value || 1),
    });
    this.boxLabelForm = new FormGroup({
      boxLabel: new FormControl(this.boxLabel, [Validators.maxLength(60)]),
    });

    this.updateQuantities();
    this.calculateDeliveryDate();
  }

  ngOnChanges(s: SimpleChanges) {
    if (s.item) {
      this.quantity = this.lineItem.quantity.value;
    }

    if (s.isConfirmed || s.orderDeliveryDate) {
      this.deliveryAfterOrderConfirmed();
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  measurementsToShow() {
    return AttributeHelper.getMeasurementsText(this.item) || false;
  }

  updateQuantities() {
    this.addToCartForm.valueChanges
      .pipe(debounceTime(500), takeUntil(this.destroy$))
      .subscribe(val => this.updateBasketItem({ itemId: this.lineItem.id, quantity: val.quantity }));
  }

  updateBasketItem(formValue: LineItemUpdate) {
    this.checkoutFacade.updateBasketItem(formValue);
  }

  removeProduct(itemId: string) {
    this.checkoutFacade.deleteBasketItem(itemId);
    this.modal.hide();
  }

  getValFromAttrs(res: LineItem[], name: string) {
    const lineItem = res.find(li => li.id === this.lineItem.id);
    return lineItem?.attributes?.find(att => att.name === name)?.value;
  }

  getField(name: string, form: FormGroup) {
    return form.get(name);
  }

  onBlur(target: HTMLDataElement, form: FormGroup) {
    if (form.invalid) {
      markAsDirtyRecursive(form);
      return;
    }
    const name = target.getAttribute('name');
    const ifLabel = name === 'boxLabel';

    const oldValue = ifLabel ? this.boxLabel : this.measurements[name];
    let value: string | number = target.value;
    if (!ifLabel && value) {
      value = +value;
    }
    const boxLabelAttribute: Attribute = { name, type: ifLabel ? 'String' : 'Double', value };

    if (oldValue) {
      if (!value) {
        this.checkoutFacade.deleteBasketItemAttributes(this.basketId, this.lineItem.id, this.bucketId, name);
      } else if (value !== oldValue) {
        this.checkoutFacade.updateBasketItemAttributes(
          this.basketId,
          this.lineItem.id,
          this.bucketId,
          boxLabelAttribute
        );
        this.setFocusedElement(target);
      }
    } else if (value) {
      this.checkoutFacade.addBasketItemAttributes(this.basketId, this.lineItem.id, this.bucketId, boxLabelAttribute);
      this.setFocusedElement(target);
    }

    if (ifLabel) {
      this.boxLabel = value as string;
    } else {
      this.measurements[name] = value as number;
    }
  }

  calculateDeliveryDate() {
    if (this.product$) {
      this.product$.pipe(take(1)).subscribe((res: ProductView) => {
        const today = new Date();
        const daysTillReady = ProductViewHelper.getDeliveryDateDays(res) + 1;
        let delivery = today.setDate(today.getDate() + daysTillReady);

        if (this.checkIfWeekend(new Date(delivery))) {
          delivery = this.setToClosestMonday(new Date(delivery));
        }

        return (this.earliestDeliveryDate = AttributeHelper.formatDeliveryDate(new Date(delivery)).replace(/-/g, '/'));
      });
    }
  }

  deliveryAfterOrderConfirmed() {
    if (this.earliestDeliveryDate) {
      const newEarliestDeliveryDate = new Date(this.earliestDeliveryDate).getTime();
      const newOrderDeliveryDate = new Date(this.orderDeliveryDate).getTime();
      let deliveryDate: string;

      if (newEarliestDeliveryDate < newOrderDeliveryDate) {
        const tempDeliveryDate = new Date(this.orderDeliveryDate).setDate(
          new Date(this.orderDeliveryDate).getDate() + 1
        );
        deliveryDate = AttributeHelper.formatDeliveryDate(new Date(tempDeliveryDate)).replace(/-/g, '/');
      } else {
        deliveryDate = this.earliestDeliveryDate;
      }

      return deliveryDate;
    }
  }

  checkIfWeekend(date) {
    return date?.getDay() === 6 || date?.getDay() === 0;
  }

  setToClosestMonday(date) {
    switch (date?.getDay()) {
      case 6:
        date.setDate(date.getDate() + 3);
        break;
      case 0:
        date.setDate(date.getDate() + 2);
        break;
      default:
        break;
    }

    return new Date(date).getTime();
  }

  openQuickViewDialog() {
    this.dialog.open(CamfilQuickViewModalComponent, {
      width: '768px',
      autoFocus: false,
      maxHeight: '80vh',
      data: { sku: this.lineItem.productSKU },
    });
  }

  openDeleteModal() {
    this.dialog.open(this.modal.show());
    this.modal.hide = () => this.dialog.closeAll();
  }

  setFocusedElement(target: HTMLDataElement) {
    this.checkoutFacade.setCheckoutFocusedElement(target.id);
  }

  getBoxLabelValue() {
    return this.lineItem?.attributes?.find(att => att.name === 'boxLabel')?.value;
  }
}
