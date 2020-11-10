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
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import { DeviceType } from 'ish-core/models/viewtype/viewtype.types';
import { ModalDialogComponent } from 'ish-shared/components/common/modal-dialog/modal-dialog.component';

import { CamCardsFacade } from '../../../facades/cam-cards.facade';
import { CamCard, CamCardItem } from '../../../models/cam-card/cam-card.model';

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
  private destroy$ = new Subject();

  constructor(
    private translate: TranslateService,
    private camCardsFacade: CamCardsFacade,
    private changeDetectorRefs: ChangeDetectorRef,
    public router: Router,
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

  getCamCardId() {
    return this.camCards?.id;
  }

  addItemsToCart() {
    // TODO: improve when NEW order/addToCartWay will be inProgress
    this.camCards.camCardItems.forEach((item: CamCardItem) => {
      this.productFacade.addProductToBasket(item.product.sku, item.quantity);
    });
    this.camCards.subCamCards.forEach((item: CamCard) => {
      item.camCardItems.forEach((subItem: CamCardItem) => {
        this.productFacade.addProductToBasket(subItem.product.sku, subItem.quantity);
      });
    });
  }

  deleteCamCard() {
    this.camCardsFacade.deleteCamCard(this.camCards.id);
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
}
