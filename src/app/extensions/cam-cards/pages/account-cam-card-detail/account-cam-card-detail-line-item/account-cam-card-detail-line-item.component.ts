import { ChangeDetectionStrategy, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { ProductView } from 'ish-core/models/product-view/product-view.model';
import { ProductCompletenessLevel } from 'ish-core/models/product/product.model';

import { CamCardsFacade } from '../../../facades/cam-cards.facade';
import { CamCard, CamCardItem } from '../../../models/cam-card/cam-card.model';

@Component({
  selector: 'camfil-account-cam-card-detail-line-item',
  templateUrl: './account-cam-card-detail-line-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountCamCardDetailLineItemComponent implements OnChanges, OnInit, OnDestroy {
  constructor(private productFacade: ShoppingFacade, private camCardsFacade: CamCardsFacade) {}

  private static REQUIRED_COMPLETENESS_LEVEL = ProductCompletenessLevel.List;
  @Input() camCardItemData: CamCardItem;
  @Input() currentCamCard: CamCard;
  @Input() selectedItemsForm: FormArray;

  addToCartForm: FormGroup;
  selectItemForm: FormGroup;
  product$: Observable<ProductView>;

  private destroy$ = new Subject<void>();

  ngOnInit() {
    this.initForm();
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
    this.addToCartForm.valueChanges
      .pipe(debounceTime(500), takeUntil(this.destroy$))
      .subscribe(val => this.updateProductQuantity(this.camCardItemData.product.sku, val.quantity));
  }

  /** init form in the beginning */
  private initForm() {
    this.addToCartForm = new FormGroup({
      quantity: new FormControl(this.camCardItemData.count || 1),
    });

    this.selectItemForm = new FormGroup({
      productCheckbox: new FormControl(true),
      sku: new FormControl(this.camCardItemData.product.sku),
    });

    this.selectedItemsForm.push(this.selectItemForm);
  }

  moveItemToOtherCamCard(camCardItemId: string, sku: string, camCardMoveData: { id: string; title: string }) {
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
        camCardMoveData.title,
        camCardItemId,
        sku,
        Number(this.addToCartForm.get('quantity').value)
      );
    }
  }

  updateProductQuantity(sku: string, quantity: number) {
    this.camCardsFacade.addProductToCamCard(this.currentCamCard.id, sku, quantity - this.camCardItemData.count);
  }

  removeProductFromCamCard(camCardItemId: string) {
    this.camCardsFacade.removeProductFromCamCard(this.currentCamCard.id, camCardItemId);
  }

  /**if the camCardItem is loaded, get product details*/
  private loadProductDetails() {
    if (!this.product$) {
      this.product$ = this.productFacade.product$(
        this.camCardItemData.product.sku,
        AccountCamCardDetailLineItemComponent.REQUIRED_COMPLETENESS_LEVEL
      );
    }
  }
}
