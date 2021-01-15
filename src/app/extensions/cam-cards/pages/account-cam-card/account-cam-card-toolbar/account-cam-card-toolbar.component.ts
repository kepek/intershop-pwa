import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { CamCardsFacade } from '../../../facades/cam-cards.facade';
import { CamCard } from '../../../models/cam-card/cam-card.model';

@Component({
  selector: 'camfil-account-cam-card-toolbar',
  templateUrl: './account-cam-card-toolbar.component.html',
  styleUrls: ['./account-cam-card-toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountCamCardToolbarComponent implements OnInit {
  @Output() addCamCard = new EventEmitter<CamCard>();
  @Output() openMoveCamCardDialog = new EventEmitter<Event>();
  @Output() addSelectedItemsToCart = new EventEmitter();
  @Output() copyCamCard = new EventEmitter<Event>();
  @Input() isSticky: boolean;
  @Input() checkedCamCards: CamCard[];
  @Input() productsChecked = {};

  constructor(private camCardsFacade: CamCardsFacade) {}

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

  isProductsChecked() {
    return Object.keys(this.productsChecked).length;
  }
}
