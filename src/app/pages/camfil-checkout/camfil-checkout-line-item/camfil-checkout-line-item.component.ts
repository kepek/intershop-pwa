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
} from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Observable, Subject } from 'rxjs';
import { debounceTime, take, takeUntil } from 'rxjs/operators';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { LineItemUpdate } from 'ish-core/models/line-item-update/line-item-update.model';
import { LineItem, LineItemView } from 'ish-core/models/line-item/line-item.model';
import { ProductView } from 'ish-core/models/product-view/product-view.model';
import { ProductCompletenessLevel } from 'ish-core/models/product/product.model';
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

  private static REQUIRED_COMPLETENESS_LEVEL = ProductCompletenessLevel.List;
  @Input() selectedItemsForm?: FormArray;
  @Input() mode?: 'edit' | 'view';
  @Input() index: number;
  @Input() basketId: string;
  @Input() bucketId: string;
  @Output() handleLoad = new EventEmitter<{ res: ProductView; quantity: number }>();
  @Output() handleUpdate = new EventEmitter<{ res: ProductView; quantity: number }>();
  boxLabelValidator = {
    boxLabel: [{ error: 'maxlength', message: 'MAX length exceeded' }],
  };
  quantity = 0;

  @Input() product: LineItemView;
  @Input() id: string;
  boxLabel: string;
  addToCartForm: FormGroup;
  boxLabelForm: FormGroup;
  selectItemForm: FormGroup;
  product$: Observable<ProductView>;

  private destroy$ = new Subject<void>();

  ngOnInit() {
    this.initForm();
    this.quantity = this.product.quantity.value;
    this.updateQuantities();
  }

  ngOnChanges(s: SimpleChanges) {
    if (s.product) {
      this.loadProductDetails();
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
  }

  /** init form in the beginning */
  private initForm() {
    this.addToCartForm = new FormGroup({
      quantity: new FormControl(this.product.quantity.value || 1),
    });
    this.boxLabelForm = new FormGroup({
      boxLabel: new FormControl(this.boxLabel ? this.boxLabel : this.getItemBoxLabel(), [Validators.maxLength(60)]),
    });
  }

  /**if the camCardItem is loaded, get product details*/
  private loadProductDetails() {
    if (!this.product$) {
      this.product$ = this.shoppingFacade.product$(
        this.id,
        CamfilCheckoutLineItemComponent.REQUIRED_COMPLETENESS_LEVEL
      );

      this.product$
        .pipe(take(1), takeUntil(this.destroy$))
        .subscribe((res: ProductView) => this.handleLoad.emit({ res, quantity: 1 }));
    }
  }

  get isEditMode() {
    return this.mode === 'edit';
  }

  get isViewMode() {
    return this.mode === 'view';
  }

  getField(name: string) {
    return this.boxLabelForm.get(name);
  }

  getItemBoxLabel() {
    let boxLabel;

    this.checkoutFacade.basketLineItems$?.pipe(take(1), takeUntil(this.destroy$)).subscribe((res: LineItem[]) => {
      const lineItem = res.find(li => li.id === this.product.id);
      const boxLabelAttribute = lineItem.attributes.find(att => att.name === 'boxLabel');

      boxLabel = boxLabelAttribute && 'value' in boxLabelAttribute ? boxLabelAttribute.value : '';
    });
    if (boxLabel) {
      this.boxLabel = boxLabel;
    }
    return boxLabel;
  }

  onBlur(target: HTMLDataElement) {
    if (this.boxLabelForm.invalid) {
      markAsDirtyRecursive(this.boxLabelForm);
      return;
    }

    const oldValue = this.boxLabel;
    const newValue = target.value;
    if (newValue && newValue !== oldValue) {
      const boxLabelAttribute = { name: 'boxLabel', type: 'String', value: newValue };
      if (!oldValue) {
        // Add attribute
        this.checkoutFacade.addBasketItemAttributes(this.basketId, this.product.id, boxLabelAttribute);
        this.boxLabel = newValue;
      } else {
        // Update existing attribute
        this.checkoutFacade.updateBasketItemAttributes(this.basketId, this.product.id, boxLabelAttribute);
      }
    } else if (!newValue && oldValue) {
      // DELETE
      this.checkoutFacade.deleteBasketItemAttributes(this.basketId, this.product.id, this.bucketId, 'boxLabel');
      this.boxLabel = '';
    } else {
      this.boxLabel = '';
    }
  }
}
