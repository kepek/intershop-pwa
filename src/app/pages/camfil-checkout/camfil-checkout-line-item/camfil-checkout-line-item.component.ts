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
import { Observable, Subject } from 'rxjs';
import { debounceTime, take, takeUntil } from 'rxjs/operators';
import { CamCardMeasurement } from 'src/app/extensions/cam-cards/models/cam-card/cam-card.model';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { AttributeHelper } from 'ish-core/models/attribute/attribute.helper';
import { Attribute } from 'ish-core/models/attribute/attribute.model';
import { LineItemUpdate } from 'ish-core/models/line-item-update/line-item-update.model';
import { LineItem, LineItemView } from 'ish-core/models/line-item/line-item.model';
import { ProductViewHelper } from 'ish-core/models/product-view/product-view.helper';
import { ProductView } from 'ish-core/models/product-view/product-view.model';
import { ProductCompletenessLevel } from 'ish-core/models/product/product.model';
import { whenTruthy } from 'ish-core/utils/operators';
import { CamfilQuickViewModalComponent } from 'ish-shared/components/common/camfil-quick-view-modal/camfil-quick-view-modal.component';
import { CamfilSmallCtaModalComponent } from 'ish-shared/components/common/camfil-small-cta-modal/camfil-small-cta-modal.component';
import { markAsDirtyRecursive } from 'ish-shared/forms/utils/form-utils';

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
  ) {}

  get isEditMode() {
    return this.mode === 'edit';
  }

  get isViewMode() {
    return this.mode === 'view';
  }

  private static REQUIRED_COMPLETENESS_LEVEL = ProductCompletenessLevel.List;
  @ViewChild(CamfilSmallCtaModalComponent) modal: CamfilSmallCtaModalComponent;
  @Input() selectedItemsForm?: FormArray;
  @Input() mode?: 'edit' | 'view';
  @Input() index: number;
  @Input() basketId: string;
  @Input() bucketId: string;
  @Input() orderDeliveryDate: number;
  @Input() isPartialDelivery: boolean;
  @Input() lineItemIndex: number;

  @Input() isConfirmed;
  @Output() handleLoad = new EventEmitter<ProductView>();
  @Output() handleUpdate = new EventEmitter<{ res: ProductView; quantity: number }>();

  earliestDeliveryDate: string;
  quantity = 0;
  boxLabel: string;
  measurementsValues = ['width', 'height', 'diameter'];
  measurements: CamCardMeasurement;
  attrsValidator = {
    boxLabel: [{ error: 'maxlength', message: 'MAX length exceeded' }],
  };

  @Input() product: LineItemView;
  @Input() id: string;

  selectItemForm: FormGroup;
  addToCartForm: FormGroup;
  boxLabelForm: FormGroup;
  /**
    // no edit for measurements on checkout now
    measurementsForm: FormGroup;
    requiresMeasurement: boolean;
  **/

  product$: Observable<ProductView>;

  private destroy$ = new Subject<void>();

  ngOnInit() {
    this.checkoutFacade.basketLineItems$?.pipe(whenTruthy(), take(1)).subscribe((res: LineItem[]) => {
      this.boxLabel = (this.getValFromAttrs(res, 'boxLabel') as string) || '';
      this.measurements = {
        [this.measurementsValues[0]]: (this.getValFromAttrs(res, 'width') as number) || undefined,
        [this.measurementsValues[1]]: (this.getValFromAttrs(res, 'height') as number) || undefined,
        [this.measurementsValues[2]]: (this.getValFromAttrs(res, 'diameter') as number) || undefined,
      };
    });

    this.initForm();
    this.quantity = this.product.quantity.value;
    this.updateQuantities();
    this.calculateDeliveryDate();
  }

  ngOnChanges(s: SimpleChanges) {
    if (s.product) {
      this.loadProductDetails();
    }
    if (s.orderDeliveryDate || s.isPartialDelivery) {
      this.calculateDeliveryDate();
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  measurementsToShow() {
    return Object.values(this.measurements)
      .filter(item => item)
      .join('x');
  }

  updateQuantities() {
    this.addToCartForm.valueChanges
      .pipe(debounceTime(500), takeUntil(this.destroy$))
      .subscribe(val => this.updateBasketItem({ itemId: this.product.id, quantity: val.quantity }));
  }

  updateBasketItem(formValue: LineItemUpdate) {
    this.checkoutFacade.updateBasketItem(formValue);
  }

  removeProduct(itemId: string) {
    this.checkoutFacade.deleteBasketItem(itemId);
    this.modal.hide();
  }

  /** init form in the beginning */
  private initForm() {
    this.addToCartForm = new FormGroup({
      quantity: new FormControl(this.product.quantity.value || 1),
    });
    this.boxLabelForm = new FormGroup({
      boxLabel: new FormControl(this.boxLabel, [Validators.maxLength(60)]),
    });

    /**
     * no edit for measurements on checkout now
     * */
    // this.measurementsForm = new FormGroup({
    //   width: new FormControl(this.measurements.width, [Validators.maxLength(4)]),
    //   height: new FormControl(this.measurements.height, [Validators.maxLength(4)]),
    //   diameter: new FormControl(this.measurements.diameter, [Validators.maxLength(4)]),
    // });
  }

  /**if the camCardItem is loaded, get product details*/
  private loadProductDetails() {
    if (!this.product$) {
      this.product$ = this.shoppingFacade.product$(
        this.id,
        CamfilCheckoutLineItemComponent.REQUIRED_COMPLETENESS_LEVEL
      );

      this.product$.pipe(take(1), takeUntil(this.destroy$)).subscribe((res: ProductView) => {
        /**
         * no edit for measurements on checkout now
        // this.requiresMeasurement = ProductHelper.getRequiresMeasurement(res);
         * */
        this.handleLoad.emit(res);
      });
    }
  }

  getValFromAttrs(res: LineItem[], name: string) {
    const lineItem = res.find(li => li.id === this.product.id);
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
        this.checkoutFacade.deleteBasketItemAttributes(this.basketId, this.product.id, this.bucketId, name);
      } else if (value !== oldValue) {
        this.checkoutFacade.updateBasketItemAttributes(
          this.basketId,
          this.product.id,
          this.bucketId,
          boxLabelAttribute
        );
      }
    } else if (value) {
      this.checkoutFacade.addBasketItemAttributes(this.basketId, this.product.id, this.bucketId, boxLabelAttribute);
    }

    if (ifLabel) {
      this.boxLabel = value as string;
    } else {
      this.measurements[name] = value as number;
    }
  }

  calculateDeliveryDate() {
    if (this.product$) {
      if (!this.isPartialDelivery && this.orderDeliveryDate) {
        return (this.earliestDeliveryDate = AttributeHelper.formatDeliveryDate(new Date(this.orderDeliveryDate)));
      } else {
        this.product$.pipe(take(1), takeUntil(this.destroy$)).subscribe((res: ProductView) => {
          const today = new Date();
          const daysTillReady = ProductViewHelper.getDeliveryDateDays(res) + 1;
          const delivery = today.setDate(today.getDate() + daysTillReady);

          return this.orderDeliveryDate && delivery < this.orderDeliveryDate
            ? (this.earliestDeliveryDate = AttributeHelper.formatDeliveryDate(new Date(this.orderDeliveryDate)))
            : (this.earliestDeliveryDate = AttributeHelper.formatDeliveryDate(new Date(delivery)));
        });
      }
    }
  }

  openQuickViewDialog() {
    this.dialog.open(CamfilQuickViewModalComponent, {
      width: '768px',
      autoFocus: false,
      maxHeight: '80vh',
      data: { sku: this.product.productSKU },
    });
  }

  openDeleteModal() {
    this.dialog.open(this.modal.show());
    this.modal.hide = () => this.dialog.closeAll();
  }
}
