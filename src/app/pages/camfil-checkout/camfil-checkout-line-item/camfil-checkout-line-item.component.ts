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
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subject } from 'rxjs';
import { debounceTime, take, takeUntil } from 'rxjs/operators';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { AttributeGroupTypes } from 'ish-core/models/attribute-group/attribute-group.types';
import { AttributeHelper } from 'ish-core/models/attribute/attribute.helper';
import { Attribute } from 'ish-core/models/attribute/attribute.model';
import { LineItemUpdate } from 'ish-core/models/line-item-update/line-item-update.model';
import { LineItem, LineItemView } from 'ish-core/models/line-item/line-item.model';
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
    public dialog: MatDialog,
    private translate: TranslateService
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
  boxLabelValidator = {
    boxLabel: [{ error: 'maxlength', message: 'MAX length exceeded' }],
  };

  @Input() product: LineItemView;
  @Input() id: string;

  addToCartForm: FormGroup;
  boxLabelForm: FormGroup;
  selectItemForm: FormGroup;

  product$: Observable<ProductView>;

  private destroy$ = new Subject<void>();

  ngOnInit() {
    this.checkoutFacade.basketLineItems$?.pipe(whenTruthy(), take(1)).subscribe((res: LineItem[]) => {
      const lineItem = res.find(li => li.id === this.product.id);
      this.boxLabel = (lineItem?.attributes?.find(att => att.name === 'boxLabel')?.value as string) || '';
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
  }

  /**if the camCardItem is loaded, get product details*/
  private loadProductDetails() {
    if (!this.product$) {
      this.product$ = this.shoppingFacade.product$(
        this.id,
        CamfilCheckoutLineItemComponent.REQUIRED_COMPLETENESS_LEVEL
      );

      this.product$.pipe(take(1), takeUntil(this.destroy$)).subscribe((res: ProductView) => this.handleLoad.emit(res));
    }
  }

  getField(name: string) {
    return this.boxLabelForm.get(name);
  }

  onBlur(target: HTMLDataElement) {
    if (this.boxLabelForm.invalid) {
      markAsDirtyRecursive(this.boxLabelForm);
      return;
    }

    const oldValue = this.boxLabel;
    const newValue = target.value;
    const boxLabelAttribute: Attribute = { name: 'boxLabel', type: 'String', value: newValue };

    if (oldValue) {
      if (!newValue) {
        this.checkoutFacade.deleteBasketItemAttributes(this.basketId, this.product.id, this.bucketId, 'boxLabel');
      } else if (newValue !== oldValue) {
        this.checkoutFacade.updateBasketItemAttributes(this.basketId, this.product.id, boxLabelAttribute);
      }
    } else if (newValue) {
      this.checkoutFacade.addBasketItemAttributes(this.basketId, this.product.id, boxLabelAttribute);
    }

    this.boxLabel = newValue;
  }

  calculateDeliveryDate() {
    if (this.product$) {
      if (!this.isPartialDelivery && this.orderDeliveryDate) {
        return (this.earliestDeliveryDate = AttributeHelper.formatDeliveryDate(new Date(this.orderDeliveryDate)));
      } else {
        this.product$.pipe(take(1), takeUntil(this.destroy$)).subscribe((res: ProductView) => {
          const today = new Date();
          let daysTillReady: number;
          if (res.attributeGroups && res.attributeGroups[AttributeGroupTypes.ProductsCheckoutAttributes]) {
            daysTillReady = Number(
              res.attributeGroups[AttributeGroupTypes.ProductsCheckoutAttributes].attributes.find(
                a => a.name === 'Deliverydays'
              ).value
            );
          } else {
            // TODO To remove. Should use only Deliverydays when attribute value is provided
            daysTillReady = res.readyForShipmentMin + this.lineItemIndex;

            if (Number.isNaN(daysTillReady)) {
              return (this.earliestDeliveryDate = this.translate.instant('camfil.checkout.line_item.article_expired'));
            }
          }
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
