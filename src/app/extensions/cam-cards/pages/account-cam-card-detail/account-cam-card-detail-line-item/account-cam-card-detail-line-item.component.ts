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

import { AppFacade } from 'ish-core/facades/app.facade';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { Channel } from 'ish-core/models/channel/channel.types';
import { Price } from 'ish-core/models/price/price.model';
import { ProductView } from 'ish-core/models/product-view/product-view.model';
import { ProductCompletenessLevel } from 'ish-core/models/product/product.model';
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
export class AccountCamCardDetailLineItemComponent implements OnChanges, OnInit, OnDestroy {
  constructor(
    private productFacade: ShoppingFacade,
    private camCardsFacade: CamCardsFacade,
    private appFacade: AppFacade,
    public dialog: MatDialog
  ) {}

  private static REQUIRED_COMPLETENESS_LEVEL = ProductCompletenessLevel.List;
  @Input() camCardItemData: CamCardItem;
  @Input() currentCamCard: CamCard;
  @Input() selectedItemsForm?: FormArray;
  @Input() mode?: 'edit' | 'view';
  @Input() index: number;
  @Input() customerPrices?: { listPrice: Price; salePrice: Price };
  @Output() handleLoad = new EventEmitter<{ res: ProductView; quantity: number }>();
  @Output() handleUpdate = new EventEmitter<{ res: ProductView; quantity: number }>();
  @Output() delete = new EventEmitter<CamCardItem>();

  quantity = 0;
  showPrice: boolean;

  addToCartForm: FormGroup;
  selectItemForm: FormGroup;
  product$: Observable<ProductView>;
  customers: CamCardCustomer[];

  @Input() showCheckbox: boolean;
  @Input() checked: boolean;
  @Output() changeCheckbox = new EventEmitter<Event>();

  private destroy$ = new Subject<void>();

  ngOnInit() {
    this.initForm();
    this.quantity = this.camCardItemData.quantity;
    this.camCardsFacade.customers$.pipe(whenTruthy(), takeUntil(this.destroy$)).subscribe(c => (this.customers = c));
    this.updateQuantities();

    this.appFacade.getChannel$
      .pipe(whenTruthy(), take(1))
      .subscribe(channel => (this.showPrice = channel !== Channel.SE));
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
    this.addToCartForm.valueChanges
      .pipe(debounceTime(500), takeUntil(this.destroy$))
      .subscribe(val => this.updateProductQuantity(this.camCardItemData, val.quantity));
  }

  changeCheck(event) {
    this.changeCheckbox.emit(event);
  }

  /** init form in the beginning */
  private initForm() {
    this.addToCartForm = new FormGroup({
      quantity: new FormControl(this.camCardItemData.quantity || 1),
    });

    if (this.selectedItemsForm) {
      this.selectItemForm = new FormGroup({
        productCheckbox: new FormControl(true),
        sku: new FormControl(this.camCardItemData.product.sku),
      });

      this.selectedItemsForm.push(this.selectItemForm);
    }
  }

  getListPrice(listPrice) {
    return this.customers.length > 1 && this.customerPrices?.salePrice ? this.customerPrices?.listPrice : listPrice;
  }

  getSalePrice(salePrice) {
    return (this.customers.length > 1 && this.customerPrices?.salePrice) || salePrice;
  }

  measurementToShow() {
    const mObj = this.camCardItemData.measurement;
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

  moveItemToOtherCamCard(camCardItemId: string, sku: string, camCardMoveData: { id: string; name: string }) {
    if (camCardMoveData.id) {
      this.camCardsFacade.moveItemToCamCard(
        this.currentCamCard.id,
        camCardMoveData.id,
        camCardItemId,
        sku,
        Number(this.addToCartForm.get('quantity').value)
      );
    } else {
      this.camCardsFacade.moveItemToNewCamCard(
        this.currentCamCard.id,
        camCardMoveData.name,
        camCardItemId,
        sku,
        Number(this.addToCartForm.get('quantity').value)
      );
    }
  }

  updateProductQuantity(camCardItem: CamCardItem, quantity: number) {
    const newItem = {
      ...camCardItem,
      quantity,
    };
    const difference = quantity - this.quantity;

    this.quantity = quantity;

    this.camCardsFacade.updateCamCardProduct(this.currentCamCard.rootCamCard, this.currentCamCard.id, newItem);
    this.product$
      .pipe(take(1), takeUntil(this.destroy$))
      .subscribe((res: ProductView) => this.handleUpdate.emit({ res, quantity: difference }));
  }

  removeProductFromCamCard(camCardItem: CamCardItem) {
    this.delete.emit(camCardItem);
  }

  /**if the camCardItem is loaded, get product details*/
  private loadProductDetails() {
    if (!this.product$) {
      this.product$ = this.productFacade.product$(
        this.camCardItemData.product.sku,
        AccountCamCardDetailLineItemComponent.REQUIRED_COMPLETENESS_LEVEL
      );

      this.product$
        .pipe(take(1), takeUntil(this.destroy$))
        .subscribe((res: ProductView) => this.handleLoad.emit({ res, quantity: this.camCardItemData.quantity }));
    }
  }

  /** Determine the heading of the delete modal and opens the modal. */
  openQuickViewDialog(camCardItemData: CamCardItem) {
    this.dialog.open(CamfilQuickViewModalComponent, {
      width: '768px',
      autoFocus: false,
      data: { sku: camCardItemData.product.sku },
    });
  }

  get isEditMode() {
    return this.mode === 'edit';
  }

  get isViewMode() {
    return this.mode === 'view';
  }
}
