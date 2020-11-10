import { animate, state, style, transition, trigger } from '@angular/animations';
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
import { MatTableDataSource } from '@angular/material/table';
import { Observable } from 'rxjs';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { DeviceType } from 'ish-core/models/viewtype/viewtype.types';

import { CamCardsFacade } from '../../../facades/cam-cards.facade';
import { CamCard, CamCardItem } from '../../../models/cam-card/cam-card.model';

export interface ProductChecked {
  camCardId: string;
  camCardRoot: string;
  sku: string;
  quantity: number;
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
  @Input() camCards: CamCard;
  @Input() selectedItemsForm: FormArray;

  @ViewChild(MatSort) sort: MatSort;
  camCardsProcessed: MatTableDataSource<CamCard>;
  isMobileView = false;
  expandedCamCard: CamCard | null;
  isSubOpen = [];
  isStickyCamCardToolbar$: Observable<boolean>;
  columnsToDisplay = ['name'];

  constructor(
    private camCardsFacade: CamCardsFacade,
    private productFacade: ShoppingFacade,
    private changeDetectorRefs: ChangeDetectorRef,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.isMobileView = this.isMobile();
    this.isStickyCamCardToolbar$ = this.camCardsFacade.isStickyCamCardToolbar$;
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes.camCards) {
      this.camCardsProcessed = new MatTableDataSource([this.camCards]);
      this.changeDetectorRefs.detectChanges();
      this.camCardsProcessed.sort = this.sort;
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
    return this.camCards?.name;
  }

  addItemsToCart() {
    // TODO: improve when NEW order/addToCartWay will be inProgress
    console.log(
      'AccountCamCardDetailListComponent -> addItemsToCart -> this.camCards.camCardItems',
      this.camCards.camCardItems
    );

    this.camCards.camCardItems.forEach((val: CamCardItem) => {
      console.log('AccountCamCardDetailListComponent -> addItemsToCart -> val', val);
      this.productFacade.addProductToBasket(val.product.sku, val.quantity);
    });
  }
}
