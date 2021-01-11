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
import { LineItemView } from 'ish-core/models/line-item/line-item.model';
import { ProductView } from 'ish-core/models/product-view/product-view.model';
import { ProductCompletenessLevel } from 'ish-core/models/product/product.model';

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
    this.boxLabel = 'Lab1';
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
      boxLabel: new FormControl(this.boxLabel, [Validators.maxLength(5)]),
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
}
