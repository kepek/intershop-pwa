import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { CamCardsFacade } from '../../../facades/cam-cards.facade';

@Component({
  selector: 'camfil-account-cam-card-detail-toolbar',
  templateUrl: './account-cam-card-detail-toolbar.component.html',
  styleUrls: ['./account-cam-card-detail-toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountCamCardDetailToolbarComponent implements OnInit {
  // @Output() addCamCard = new EventEmitter<CamCard>();
  // @Output() openMoveCamCardDialog = new EventEmitter<Event>();
  @Output() addItemsToCart = new EventEmitter();
  @Input() isSticky: boolean;
  @Input() title: string;

  dummyProduct = { sku: 'dummy', inStock: true, availability: true };

  constructor(private camCardsFacade: CamCardsFacade) {}

  ngOnInit() {
    this.camCardsFacade.detectCamCardToolbar();
  }

  addToCart() {
    this.addItemsToCart.emit();
  }

  // add(camCard: CamCard) {
  //   this.addCamCard.emit(camCard);
  // }

  // move(event: Event) {
  //   this.openMoveCamCardDialog.emit(event);
  // }
}
