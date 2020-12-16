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
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Observable, Subject } from 'rxjs';
import { debounceTime, take, takeUntil } from 'rxjs/operators';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { ProductView } from 'ish-core/models/product-view/product-view.model';
import { ProductCompletenessLevel } from 'ish-core/models/product/product.model';

@Component({
  selector: 'camfil-checkout-line-item',
  templateUrl: './camfil-checkout-line-item.component.html',
  styleUrls: ['./camfil-checkout-line-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilCheckoutLineItemComponent implements OnChanges, OnInit, OnDestroy {
  constructor(private shoppingFacade: ShoppingFacade, public dialog: MatDialog) {}

  private static REQUIRED_COMPLETENESS_LEVEL = ProductCompletenessLevel.List;
  @Input() selectedItemsForm?: FormArray;
  @Input() mode?: 'edit' | 'view';
  @Input() index: number;
  @Output() handleLoad = new EventEmitter<{ res: ProductView; quantity: number }>();
  @Output() handleUpdate = new EventEmitter<{ res: ProductView; quantity: number }>();

  quantity = 0;

  @Input() id: string;
  addToCartForm: FormGroup;
  selectItemForm: FormGroup;
  product$: Observable<ProductView>;
  private destroy$ = new Subject<void>();

  ngOnInit() {
    this.loadProductDetails();
    this.initForm();
    // this.quantity = this.camCardItemData.quantity;
    this.updateQuantities();
  }

  ngOnChanges(s: SimpleChanges) {
    if (s.camCardItemData) {
      this.loadProductDetails();
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  updateQuantities() {
    this.addToCartForm.valueChanges.pipe(debounceTime(500), takeUntil(this.destroy$));
    // .subscribe(val => this.updateProductQuantity(this.camCardItemData, val.quantity));
  }

  /** init form in the beginning */
  private initForm() {
    this.addToCartForm = new FormGroup({
      quantity: new FormControl(1),
    });

    // if (this.selectedItemsForm) {
    //   this.selectItemForm = new FormGroup({
    //     productCheckbox: new FormControl(true),
    //     sku: new FormControl(this.camCardItemData.product.sku),
    //   });

    //   this.selectedItemsForm.push(this.selectItemForm);
    // }
  }

  /**if the camCardItem is loaded, get product details*/
  private loadProductDetails() {
    if (!this.product$) {
      // this.product$ = this.productFacade.product$(this.id, CamfilCheckoutLineItemComponent.REQUIRED_COMPLETENESS_LEVEL);

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
}
