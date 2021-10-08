import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatTooltip } from '@angular/material/tooltip';
import { Subject } from 'rxjs';

import { CamCardsFacade } from '../../../facades/cam-cards.facade';
import { CamCard } from '../../../models/cam-card/cam-card.model';

@Component({
  selector: 'camfil-account-cam-card-toolbar',
  templateUrl: './account-cam-card-toolbar.component.html',
  styleUrls: ['./account-cam-card-toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountCamCardToolbarComponent implements OnInit, OnDestroy {
  @Output() addCamCard = new EventEmitter<CamCard>();
  @Output() openMoveCamCardDialog = new EventEmitter<Event>();
  @Output() openImportCamCardDialog = new EventEmitter<Event>();
  @Output() addSelectedItemsToCart = new EventEmitter();
  @Output() copyCamCard = new EventEmitter<Event>();
  @Input() isSticky: boolean;
  @Input() checkedCamCards: CamCard[];
  @Input() productsChecked = {};
  @Input() productAddingInProgress: boolean;

  @ViewChild(MatTooltip) addToCamCardTooltip: MatTooltip;

  private destroy$ = new Subject<void>();

  constructor(private camCardsFacade: CamCardsFacade) {}

  get isProductsChecked() {
    return Object.keys(this.productsChecked).length;
  }

  ngOnInit() {
    this.camCardsFacade.detectCamCardToolbar();
  }

  add(camCard: CamCard) {
    this.addCamCard.emit(camCard);
  }

  move(event: Event) {
    this.openMoveCamCardDialog.emit(event);
  }

  copy(event: Event) {
    this.copyCamCard.emit(event);
  }

  addToCart() {
    this.addSelectedItemsToCart.emit();
  }

  isAddToCartBtnDisabled() {
    return !this.isProductsChecked || this.productAddingInProgress;
  }

  importCamCard(event: Event) {
    this.openImportCamCardDialog.emit(event);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
