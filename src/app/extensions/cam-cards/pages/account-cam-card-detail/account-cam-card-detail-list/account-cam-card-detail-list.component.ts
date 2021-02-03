import { animate, state, style, transition, trigger } from '@angular/animations';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormArray } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { Price } from 'ish-core/models/price/price.model';
import { DeviceType } from 'ish-core/models/viewtype/viewtype.types';
import { CamfilModalDialogComponent } from 'ish-shared/components/common/camfil-modal-dialog/camfil-modal-dialog.component';

import { CamCardsFacade } from '../../../facades/cam-cards.facade';
import { CamCard, CamCardItem } from '../../../models/cam-card/cam-card.model';

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
export class AccountCamCardDetailListComponent implements OnInit, OnChanges {
  @Input() deviceType: DeviceType;
  @Input() camCard: CamCard;
  @Input() selectedItemsForm: FormArray;

  @ViewChild(MatSort) sort: MatSort;
  isMobileView = false;

  isSubOpen = [];
  isStickyCamCardToolbar$: Observable<boolean>;
  priceSum: Prices = {};
  POSITION_GAP_SIZE = 999;

  constructor(
    private translate: TranslateService,
    private camCardsFacade: CamCardsFacade,
    private shoppingFacade: ShoppingFacade,
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
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.camCard) {
      this.changeDetectorRefs.detectChanges();
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

  get sumPrice(): Price {
    const list = Object.values(this.priceSum);
    const currency = list.length ? list[0].currency : '';
    const value = list.reduce((res, item) => res + item.value, 0);
    return { value, type: 'Money', currency };
  }

  productUpdate(event, item: CamCardItem) {
    if (event.res.salePrice?.value) {
      const price = event.res.salePrice.value * item.quantity;
      this.priceSum[item.id] = { ...event.res.salePrice, value: price };
    }
  }

  addItemsToCart() {
    const urn = this.camCard.deliveryAddress.urn;
    this.camCard.camCardItems?.forEach(item => {
      this.addItemToCart(item, urn);
    });
    this.camCard.subCamCards?.forEach(sub => {
      sub.camCardItems?.forEach(item => {
        this.addItemToCart(item, urn);
      });
    });
  }
  addItemToCart(item: CamCardItem, urn: string) {
    if (item.product.available) {
      this.shoppingFacade.addProductToBasket(item.product.sku, item.quantity, urn);
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
    this.camCardsFacade.removeProductFromCamCard(this.camCard.id, camCardItemId);
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
    this.camCardsFacade.updateCamCardProduct(rootCamCardId, camcardId, newItem);
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
