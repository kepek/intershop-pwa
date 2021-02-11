import { animate, state, style, transition, trigger } from '@angular/animations';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormArray } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { Address } from 'ish-core/models/address/address.model';
import { BasketView } from 'ish-core/models/basket/basket.model';
import { Bucket } from 'ish-core/models/basket/bucket.model';
import { Price } from 'ish-core/models/price/price.model';
import { DeviceType } from 'ish-core/models/viewtype/viewtype.types';
import { whenTruthy } from 'ish-core/utils/operators';
import { CamfilModalDialogComponent } from 'ish-shared/components/common/camfil-modal-dialog/camfil-modal-dialog.component';

import { CamCardsFacade } from '../../../facades/cam-cards.facade';
import { CamCardHelper } from '../../../models/cam-card/cam-card.helper';
import { CamCamProductChecked, CamCard, CamCardItem } from '../../../models/cam-card/cam-card.model';

export interface Prices {
  [id: string]: Price;
}

@Component({
  selector: 'camfil-account-cam-card-detail-list',
  templateUrl: './account-cam-card-detail-list.component.html',
  styleUrls: ['./account-cam-card-detail-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class AccountCamCardDetailListComponent implements OnInit, OnChanges, OnDestroy {
  @Input() deviceType: DeviceType;
  @Input() camCard: CamCard;
  @Input() selectedItemsForm: FormArray;

  @ViewChild(MatSort) sort: MatSort;
  isMobileView = false;

  basket$: Observable<BasketView>;
  buckets$: Observable<any[]>;
  buckets: Bucket[];
  basketId: string;
  basketAddresses: Address[];
  commonShippingMethodId: string;

  isSubOpen = [];
  isStickyCamCardToolbar$: Observable<boolean>;
  priceSum: Prices = {};
  POSITION_GAP_SIZE = 999;

  private destroy$ = new Subject();

  constructor(
    private translate: TranslateService,
    private camCardsFacade: CamCardsFacade,
    private shoppingFacade: ShoppingFacade,
    private checkoutFacade: CheckoutFacade,
    private changeDetectorRefs: ChangeDetectorRef,
    public router: Router,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.isMobileView = this.isMobile();
    this.isStickyCamCardToolbar$ = this.camCardsFacade.isStickyCamCardToolbar$;

    // expand all subCamCards
    if (this.camCard) {
      this.camCard.subCamCards.forEach(sub => {
        this.toggleSubCamCard(sub.id);
      });
    }

    this.shoppingFacade.loadBasketAddresses();
    this.basket$ = this.checkoutFacade.basket$;
    this.buckets$ = this.checkoutFacade.buckets$;

    this.basket$.pipe(whenTruthy(), takeUntil(this.destroy$)).subscribe((basket: BasketView) => {
      this.basketId = basket.id;
      this.commonShippingMethodId = basket.commonShippingMethod?.id;
    });
    this.buckets$.pipe(whenTruthy(), takeUntil(this.destroy$)).subscribe((buckets: Bucket[]) => {
      this.buckets = buckets;
    });
    this.shoppingFacade.basketAddresses$.pipe(takeUntil(this.destroy$)).subscribe((basketAddresses: Address[]) => {
      this.basketAddresses = basketAddresses;
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.camCard) {
      this.changeDetectorRefs.detectChanges();

      // update priceSum
      const currentCamCardItemsId = CamCardHelper.getCamCardItemsId(this.camCard);
      const priceItemToRemove = Object.keys(this.priceSum).filter(key => !currentCamCardItemsId.includes(key));
      priceItemToRemove.forEach(item => this.cleanPriceSum(item));
    }
    this.isMobileView = this.isMobile();
  }

  isMobile() {
    return this.deviceType === 'mobile'; // || this.deviceType === 'tablet';
  }
  simplifyData(data) {
    return data.toLowerCase().trim();
  }

  isSubCamCardOpen(id: string) {
    return this.isSubOpen.indexOf(id) > -1;
  }

  toggleSubCamCard(id: string) {
    const index = this.isSubOpen.indexOf(id);
    this.isSubCamCardOpen(id) ? this.isSubOpen.splice(index, 1) : this.isSubOpen.push(id);
  }

  getCamCardName() {
    return this.camCard?.name;
  }

  get totalPrice(): Price {
    const list = Object.values(this.priceSum);
    const currency = list.length ? list[0].currency : '';
    const value = list.reduce((res, item) => res + (item?.value || 0), 0);
    return { value, type: 'Money', currency };
  }

  cleanPriceSum(id: string) {
    delete this.priceSum[id];
  }

  productUpdate(event, item: CamCardItem) {
    if (event.res.salePrice?.value) {
      const price = event.res.salePrice.value * item.quantity;
      this.priceSum[item.id] = { ...event.res.salePrice, value: price };
    }
  }

  addItemsToCart() {
    this.camCard.camCardItems?.forEach(item => {
      this.addItemToCart(item);
    });
    this.camCard.subCamCards?.forEach(sub => {
      sub.camCardItems?.forEach(item => {
        this.addItemToCart(item);
      });
    });
  }
  addItemToCart(item: CamCardItem) {
    if (item.product.available) {
      const val: CamCamProductChecked = {
        camCardId: this.camCard.id,
        camCardRoot: this.camCard.rootCamCard,
        sku: item.product.sku,
        quantity: item.quantity,
        boxLabel: item.comment?.label,
      };
      CamCardHelper.addToCartFromCamCard(
        val,
        [this.camCard],
        this.buckets,
        this.camCardsFacade,
        this.shoppingFacade,
        this.commonShippingMethodId,
        this.basketId,
        this.basketAddresses
      );
    }
  }

  deleteCamCard() {
    this.camCardsFacade.deleteCamCard(this.camCard.id);
    this.router.navigate(['/account/camcards']);
  }

  deleteSubCamCard(sub: CamCard) {
    this.camCardsFacade.deleteSubCamCard(sub.rootCamCard, sub.id);
  }

  deleteProduct(camCardItemId: string) {
    const camCard = this.camCard.camCardItems.find(item => item.id === camCardItemId)
      ? this.camCard
      : this.camCard.subCamCards.find(sub => sub.camCardItems.find(item => item.id === camCardItemId));
    this.camCardsFacade.removeProductFromCamCard(camCard.id, camCardItemId, camCard.rootCamCard);
  }

  /** Determine the heading of the delete modal and opens the modal. */
  openDeleteConfirmationDialog(
    modal: CamfilModalDialogComponent<string | CamCard>,
    camCard: CamCard,
    type?: 'cc' | 'sub' | 'product',
    camCardItem?: CamCardItem
  ) {
    const header = `camfil.dynamic.account.cam_card.delete_dialog.${type}.header`;
    const name = camCardItem ? camCardItem.product.sku : camCard.name;
    modal.options.titleText = this.translate.instant(header, { 0: name });

    const data = camCardItem ? camCardItem.id : type === 'sub' ? camCard : camCard.id;
    modal.show(data);
  }

  /** Set position attribute of a CamCardItem */
  updateProductPosition(camCardItem: CamCardItem, camcardId: string, position: number) {
    const newItem = {
      ...camCardItem,
      position,
    };

    const rootCamCardId = this.camCard.id === camcardId ? undefined : this.camCard.id;
    this.camCardsFacade.updateCamCardProduct(rootCamCardId, camcardId, newItem, true);
  }

  /** dispatch edit request */
  updateCamCard(camCard: CamCard) {
    this.camCardsFacade.updateCamCard(camCard);
  }

  /** Returns the new position of the dropped item. Resets gaps if too small */
  getTargetPosition(previousIndex, currentIndex, items, targetCamCard) {
    // sort first because currentIndex contains only the 'visible' position
    items.sort((a, b) => (a.position < b.position ? -1 : 1));
    let predecessorPos;
    let successorPos;
    let targetPos;

    if (previousIndex === undefined || previousIndex > currentIndex) {
      /** moving item upwards or to another camcard */
      predecessorPos = items[currentIndex - 1]?.position;
      successorPos = items[currentIndex]?.position;
    } else {
      /** moving item downwards */
      predecessorPos = items[currentIndex]?.position;
      successorPos = items[currentIndex + 1]?.position;
    }

    if (predecessorPos === undefined && successorPos === undefined) {
      return; // 1000, set by ICM
    } else if (predecessorPos === undefined) {
      targetPos = successorPos - this.POSITION_GAP_SIZE;
    } else if (successorPos === undefined) {
      targetPos = predecessorPos + this.POSITION_GAP_SIZE;
    } else {
      const gap = successorPos - predecessorPos;

      if (gap <= 2) {
        this.camCardsFacade.resetItemPositions(targetCamCard);
      }
      targetPos = Math.round(gap / 2) + predecessorPos;
    }
    // skip 0
    return targetPos ? targetPos : 1;
  }

  /** Handle drag & drop event */
  drop(event: CdkDragDrop<string[]>, targetCamCard: CamCard) {
    // dropped item in the same CamCard/SubCamCard
    if (event.previousContainer === event.container) {
      // same position, do nothing
      if (event.previousIndex === event.currentIndex) {
        return;
      }
      const items: CamCardItem[] = Object.keys(event.container.data).map(i => event.container.data[i]);
      const targetPos = this.getTargetPosition(event.previousIndex, event.currentIndex, items, targetCamCard);

      this.updateProductPosition(event.item.data, targetCamCard.id, targetPos);
    } else {
      // dropped inside another camcard
      const items: CamCardItem[] = Object.keys(event.container.data).map(i => event.container.data[i]);
      const targetPos = this.getTargetPosition(undefined, event.currentIndex, items, targetCamCard);

      // move camcard
      const sourceCamCardId = document.getElementById(event.previousContainer.id).dataset.camCardId;
      this.camCardsFacade.moveCamCardItem(sourceCamCardId, targetCamCard.id, event.item.data, targetPos);
    }
  }
}
