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
import { Observable, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { Price } from 'ish-core/models/price/price.model';
import { DeviceType } from 'ish-core/models/viewtype/viewtype.types';
import { ModalDialogComponent } from 'ish-shared/components/common/modal-dialog/modal-dialog.component';

import { CamCardsFacade } from '../../../facades/cam-cards.facade';
import { CamCard, CamCardItem } from '../../../models/cam-card/cam-card.model';

@Component({
  selector: 'camfil-account-cam-card-detail-list',
  templateUrl: './account-cam-card-detail-list.component.html',
  styleUrls: ['./account-cam-card-detail-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
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
  expandedCamCard: CamCard | null;
  isSubOpen = [];
  isStickyCamCardToolbar$: Observable<boolean>;
  // TODO: improve when user locale will be properlyused
  priceSum: Price = { currency: 'USD', value: 0, type: 'Money' };
  private destroy$ = new Subject();
  POSITION_GAP_SIZE = 1000000;

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
    console.log('AccountCamCardDetailListComponent -> ngOnChanges -> ngOnChanges');
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

  productUpdate(event) {
    if (event.res.salePrice.value) {
      this.priceSum.value = this.priceSum.value + event.res.salePrice.value * event.quantity;
    }
  }

  addItemsToCart() {
    // TODO: improve when NEW order/addToCartWay will be inProgress
    this.camCard.camCardItems?.map(item => {
      this.shoppingFacade.addProductToBasket(item.product.sku, item.quantity);
    });
    this.camCard.subCamCards?.map(sub => {
      sub.camCardItems?.map(item => {
        this.shoppingFacade.addProductToBasket(item.product.sku, item.quantity);
      });
    });
  }

  deleteCamCard() {
    this.camCardsFacade.deleteCamCard(this.camCard.id);
    this.router.navigate(['/account/cam-cards']);
  }

  /** Determine the heading of the delete modal and opens the modal. */
  openDeleteConfirmationDialog(camCard: CamCard, modal: ModalDialogComponent<string>) {
    this.translate
      .get('camfil.account.cam_cards.delete_dialog.header', { 0: camCard.name })
      .pipe(take(1), takeUntil(this.destroy$))
      .subscribe(res => (modal.options.titleText = res));

    modal.show(camCard.id);
  }

  /** Set position attribute of a CamCardItem */
  updateProductPosition(camCardItem: CamCardItem, camcardId: string, position: number) {
    console.log('AccountCamCardDetailListComponent -> updateProductPosition -> camcardId', camcardId);
    console.log('AccountCamCardDetailListComponent -> updateProductPosition -> this.camCard.id', this.camCard.id);
    console.log('AccountCamCardDetailListComponent -> updateProductPosition -> rootCamCard', this.camCard.rootCamCard);

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
  getTargetPosition(previousIndex, currentIndex, items, targetCamCardId, rootCamCardId) {
    console.log('🚀 ~ getTargetPosition ~ rootCamCardId', rootCamCardId);
    console.log('🚀 ~ getTargetPosition ~ targetCamCardId', targetCamCardId);
    console.log('🚀 ~ getTargetPosition ~ items', items);
    console.log('🚀 ~ getTargetPosition ~ currentIndex', currentIndex);
    console.log('🚀 ~ getTargetPosition ~ previousIndex', previousIndex);

    // sort first because currentIndex contains only the 'visible' position
    items.sort((a, b) => (a.position < b.position ? -1 : 1));
    let predecessorPos;
    let successorPos;

    //
    if (!previousIndex) {
      /** moving item into another camcard */
      console.log('moving item into another camcard');
      predecessorPos = items[currentIndex - 1]?.position;
      successorPos = items[currentIndex]?.position;
    } else if (previousIndex > currentIndex) {
      /** moving item upwards */
      console.log('moving item upwards');
      predecessorPos = items[currentIndex - 1]?.position;
      successorPos = items[currentIndex]?.position;
    } else {
      /** moving item downwards */
      console.log('moving item downwards');
      predecessorPos = items[currentIndex]?.position;
      successorPos = items[currentIndex + 1]?.position;
    }

    console.log('🚀 getTargetPosition ~ successorPos', successorPos);
    console.log('🚀 getTargetPosition ~ predecessorPos', predecessorPos);

    if (predecessorPos === undefined && successorPos === undefined) {
      return 0;
    }

    if (predecessorPos === undefined) {
      return successorPos - this.POSITION_GAP_SIZE;
    }

    if (successorPos === undefined) {
      return predecessorPos + this.POSITION_GAP_SIZE;
    }

    const gap = successorPos - predecessorPos;
    if (gap <= 2) {
      this.camCardsFacade.resetItemPositions(rootCamCardId, targetCamCardId, this.POSITION_GAP_SIZE);
    }

    return Math.round(gap / 2) + predecessorPos;
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
      const targetPos = this.getTargetPosition(
        event.previousIndex,
        event.currentIndex,
        items,
        targetCamCard.id,
        targetCamCard.rootCamCard
      );
      console.log('AccountCamCardDetailListComponent -> drop -> targetPos', targetPos);
      this.updateProductPosition(event.item.data, targetCamCard.id, targetPos);
    } else {
      // dropped inside another camcard
      console.log('### dropped inside another camcard');
      const items: CamCardItem[] = Object.keys(event.container.data).map(i => event.container.data[i]);
      const targetPos = this.getTargetPosition(
        undefined,
        event.currentIndex,
        items,
        targetCamCard.id,
        targetCamCard.rootCamCard
      );
      console.log('AccountCamCardDetailListComponent -> drop -> targetPos', targetPos);

      // move camcard
      const sourceCamCardId = document.getElementById(event.previousContainer.id).dataset.camCardId;
      const rootCamCardId = this.camCard.id === targetCamCard.id ? undefined : this.camCard.id;
      console.log('AccountCamCardDetailListComponent -> drop -> rootCamCardId', rootCamCardId);
      this.camCardsFacade.moveItemToCamCard(
        sourceCamCardId,
        targetCamCard.id,
        event.item.data.id,
        event.item.data.product.sku,
        event.item.data.quantity,
        targetPos
      );
    }
  }
}
