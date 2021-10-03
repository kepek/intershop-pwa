import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { debounceTime, takeUntil, withLatestFrom } from 'rxjs/operators';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { AttributeHelper } from 'ish-core/models/attribute/attribute.helper';
import { Attribute } from 'ish-core/models/attribute/attribute.model';
import { LineItemUpdate } from 'ish-core/models/line-item-update/line-item-update.model';
import { LineItem, LineItemView } from 'ish-core/models/line-item/line-item.model';
import { ProductView } from 'ish-core/models/product-view/product-view.model';
import { ProductCompletenessLevel } from 'ish-core/models/product/product.model';
import { CheckoutFocusedElement } from 'ish-core/models/scroll-info copy/checkout-focused-element.interface';
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
  @Output() openDeleteModalAction = new EventEmitter();
  @Output() resizeLineItemOnBlur = new EventEmitter();
  @Output() addHeightToViewport = new EventEmitter<string>();
  earliestDeliveryDate: Date;
  boxLabel: string;
  measurementsValues = ['width', 'height', 'diameter'];
  measurements: CamCardMeasurement;
  attrsValidator = {
    boxLabel: [{ error: 'maxlength', message: 'MAX length exceeded' }],
  };
  product$: Observable<ProductView>;
  addToCartForm: FormGroup;
  addToCartQuantityControl: FormControl;
  boxLabelForm: FormGroup;
  private destroy$ = new Subject<void>();
  private sku$ = new ReplaySubject<string>(1);

  constructor(
    private shoppingFacade: ShoppingFacade,
    private checkoutFacade: CheckoutFacade,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.product$ = this.shoppingFacade.product$(
      this.sku$,
      CamfilCheckoutLineItemComponent.REQUIRED_COMPLETENESS_LEVEL
    );

    this.addToCartQuantityControl = new FormControl(this.lineItem?.quantity?.value || 1);

    this.addToCartForm = new FormGroup({
      quantity: this.addToCartQuantityControl,
    });

    this.addToCartQuantityControl?.valueChanges
      .pipe(debounceTime(500), withLatestFrom(this.product$), takeUntil(this.destroy$))
      .subscribe(([quantity, product]) => {
        const { minOrderQuantity, maxOrderQuantity } = product;

        if (quantity < minOrderQuantity) {
          return;
        }

        if (quantity >= maxOrderQuantity) {
          return;
        }

        if (this.addToCartQuantityControl?.value !== this.lineItem?.quantity?.value) {
          this.updateBasketItem({ itemId: this.lineItem.id, quantity });
        }
      });

    this.boxLabelForm = new FormGroup({
      boxLabel: new FormControl('', [Validators.maxLength(60)]),
    });

    this.applyLineItemParameters(this.lineItem);
    this.calculateDeliveryDate();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.sku$.next(this.lineItem?.productSKU);

    if (changes.lineItem) {
      this.applyLineItemParameters(this.lineItem);
      this.calculateDeliveryDate();
    }

    if (changes.lineItem && this.addToCartQuantityControl?.value !== this.lineItem?.quantity?.value) {
      this.addToCartQuantityControl?.setValue(this.lineItem?.quantity?.value);
    }

    if (changes.isConfirmed || changes.orderDeliveryDate) {
      this.deliveryAfterOrderConfirmed();
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  measurementsToShow() {
    return AttributeHelper.getMeasurementsText(this.lineItem) || false;
  }

  updateBasketItem(formValue: LineItemUpdate) {
    this.checkoutFacade.updateBasketItem(formValue);
  }

  removeProduct(itemId: string) {
    this.checkoutFacade.deleteBasketItem(itemId);
    this.modal.hide();
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
      this.boxLabel?.length > 28
        ? this.resizeLineItemOnBlur.emit('increase')
        : this.resizeLineItemOnBlur.emit('decrease');
    } else {
      this.measurements[name] = value as number;
    }
  }

  calculateDeliveryDate() {
    let delivery = new Date(this.lineItem.earliestDeliveryDate);

    if (this.checkIfWeekend(delivery)) {
      delivery = this.setToClosestMonday(delivery);
    }

    this.earliestDeliveryDate = new Date(AttributeHelper.formatDeliveryDate(delivery));
  }

  deliveryAfterOrderConfirmed() {
    if (this.earliestDeliveryDate) {
      const orderDeliveryDate = new Date(this.orderDeliveryDate);
      const newEarliestDeliveryDate = new Date(this.earliestDeliveryDate).getTime();
      const newOrderDeliveryDate = orderDeliveryDate.getTime();
      let deliveryDate = this.earliestDeliveryDate;

      if (newEarliestDeliveryDate < newOrderDeliveryDate) {
        deliveryDate = new Date(AttributeHelper.formatDeliveryDate(orderDeliveryDate));
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

    return new Date(date);
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
    this.openDeleteModalAction.emit();
  }

  setFocusedElement(target: HTMLDataElement) {
    this.checkoutFacade.setCheckoutFocusedElement(target.id);
  }

  getBoxLabelValue() {
    return this.lineItem?.attributes?.find(att => att.name === 'boxLabel')?.value;
  }

  private applyLineItemParameters(lineItem: LineItem) {
    const boxLabel = (this.getValFromAttrs(lineItem, 'boxLabel') as string) || '';
    const width = (this.getValFromAttrs(lineItem, 'width') as number) || undefined;
    const height = (this.getValFromAttrs(lineItem, 'height') as number) || undefined;
    const diameter = (this.getValFromAttrs(lineItem, 'diameter') as number) || undefined;

    this.boxLabel = boxLabel;
    this.measurements = {
      [this.measurementsValues[0]]: width,
      [this.measurementsValues[1]]: height,
      [this.measurementsValues[2]]: diameter,
    };

    this.boxLabelForm?.get('boxLabel').setValue(boxLabel);
  }

  private getValFromAttrs(lineItem: LineItem, name: string) {
    return lineItem?.attributes?.find(att => att.name === name)?.value;
  }
}
