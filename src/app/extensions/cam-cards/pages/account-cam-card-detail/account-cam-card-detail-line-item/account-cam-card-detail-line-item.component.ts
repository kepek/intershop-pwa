import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CamfilShoppingFacade } from 'camfil-pwa/facades/camfil-shopping.facade';
import { Observable, Subject } from 'rxjs';
import { debounceTime, take, takeUntil } from 'rxjs/operators';
import { Memoize } from 'typescript-memoize';

import { AppFacade } from 'ish-core/facades/app.facade';
import { Channel } from 'ish-core/models/channel/channel.types';
import { Price } from 'ish-core/models/price/price.model';
import { ProductView } from 'ish-core/models/product-view/product-view.model';
import { ProductCompletenessLevel } from 'ish-core/models/product/product.helper';
import { whenTruthy } from 'ish-core/utils/operators';
import { CamfilQuickViewModalComponent } from 'ish-shared/components/common/camfil-quick-view-modal/camfil-quick-view-modal.component';

import { CamCardsFacade } from '../../../facades/cam-cards.facade';
import { CamCard, CamCardCustomer, CamCardItem } from '../../../models/cam-card/cam-card.model';

@Component({
  selector: 'camfil-account-cam-card-detail-line-item',
  templateUrl: './account-cam-card-detail-line-item.component.html',
  styleUrls: ['./account-cam-card-detail-line-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountCamCardDetailLineItemComponent implements OnInit, OnDestroy {
  constructor(
    private shoppingFacade: CamfilShoppingFacade,
    private camCardsFacade: CamCardsFacade,
    private appFacade: AppFacade,
    public dialog: MatDialog
  ) {}

  @Memoize()
  get isEditMode() {
    return this.mode === 'edit';
  }

  @Memoize()
  get isViewMode() {
    return this.mode === 'view';
  }

  private static REQUIRED_COMPLETENESS_LEVEL = ProductCompletenessLevel.List;
  private destroy$ = new Subject<void>();

  @Input()
  camCard: CamCard;

  private camCardItemValue: CamCardItem;
  get camCardItem(): CamCardItem {
    return this.camCardItemValue;
  }

  @Input()
  set camCardItem(v: CamCardItem) {
    this.camCardItemValue = v;
  }

  @Input() selectedItemsForm?: FormArray;
  @Input() mode?: 'edit' | 'view';
  @Input() index: number;
  @Input() customerPrices?: { listPrice: Price; salePrice: Price };
  @Input() isIntervalVisible = false;
  @Input() showCheckbox: boolean;
  @Input() checked: boolean;

  @Output() changeCheckbox = new EventEmitter<Event>();
  @Output() handleUpdate = new EventEmitter<{ res: ProductView; quantity: number }>();
  @Output() delete = new EventEmitter<CamCardItem>();

  showPrice: boolean;
  addToCartForm: FormGroup;
  selectItemForm: FormGroup;
  product$: Observable<ProductView>;
  customers: CamCardCustomer[];

  private quantityValue = 0;

  @Memoize()
  get quantity() {
    return this.quantityValue;
  }

  set quantity(v: number) {
    this.quantityValue = v;
  }

  ngOnInit() {
    this.initForm();

    this.quantity = this.camCardItem?.quantity || 0;

    this.camCardsFacade.customers$.pipe(whenTruthy(), takeUntil(this.destroy$)).subscribe(c => (this.customers = c));

    this.product$ = this.shoppingFacade.getProduct$(
      this.camCardItem?.product?.sku,
      AccountCamCardDetailLineItemComponent.REQUIRED_COMPLETENESS_LEVEL
    );

    this.updateQuantity();

    this.appFacade.getChannel$
      .pipe(whenTruthy(), take(1))
      // TODO (extMlk): hidePricesCamCards settings
      .subscribe(channel => (this.showPrice = channel !== Channel.SE));
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  updateQuantity() {
    this.addToCartForm.valueChanges
      .pipe(debounceTime(500), takeUntil(this.destroy$))
      .subscribe(val => this.updateProductQuantity(this.camCardItem, val.quantity));
  }

  changeCheck(event) {
    this.changeCheckbox.emit(event);
  }

  getListPrice(listPrice) {
    return !!this.customers?.length && this.customerPrices?.salePrice ? this.customerPrices?.listPrice : listPrice;
  }

  getSalePrice(salePrice) {
    return !!this.customers?.length && this.customerPrices?.salePrice ? this.customerPrices?.salePrice : salePrice;
  }

  @Memoize()
  get measurementToShow() {
    const mObj = this.camCardItem.measurement;
    if (!mObj) {
      return;
    }
    const sortedKeys = Object.keys(mObj)
      .sort()
      .reverse()
      .reduce((r, k) => {
        r[k] = mObj[k];
        return r;
      }, {});

    return Object.values(sortedKeys)
      .filter(item => item && typeof item === 'number')
      .join('x');
  }

  updateProductQuantity(camCardItem: CamCardItem, quantity: number) {
    this.product$.pipe(take(1), takeUntil(this.destroy$)).subscribe((res: ProductView) => {
      const { maxOrderQuantity, minOrderQuantity } = res;

      if (quantity < minOrderQuantity) {
        return;
      }

      if (quantity >= maxOrderQuantity) {
        return;
      }

      const difference = quantity - this.quantity;

      this.quantity = quantity;

      const newItem = {
        ...camCardItem,
        quantity,
      };

      this.camCardsFacade.updateCamCardProduct(this.camCard.rootCamCard, this.camCard.id, newItem);
      this.handleUpdate.emit({ res, quantity: difference });
    });
  }

  removeProductFromCamCard(camCardItem: CamCardItem) {
    this.delete.emit(camCardItem);
  }

  /** Determine the heading of the delete modal and opens the modal. */
  openQuickViewDialog(camCardItem: CamCardItem) {
    this.dialog.open(CamfilQuickViewModalComponent, {
      width: '768px',
      autoFocus: false,
      data: { sku: camCardItem.product.sku },
    });
  }

  /** init form in the beginning */
  private initForm() {
    this.addToCartForm = new FormGroup({
      quantity: new FormControl(this.camCardItem?.quantity || 1, { updateOn: 'blur' }),
    });

    if (this.selectedItemsForm) {
      this.selectItemForm = new FormGroup({
        productCheckbox: new FormControl(true),
        sku: new FormControl(this.camCardItem?.product?.sku),
      });

      this.selectedItemsForm.push(this.selectItemForm);
    }
  }
}
