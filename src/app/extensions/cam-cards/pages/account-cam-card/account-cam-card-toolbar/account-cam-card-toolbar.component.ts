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
  @Output() addSelectedItemsToCart = new EventEmitter();
  @Input() isSticky: boolean;

  constructor(private camCardsFacade: CamCardsFacade) {}

  ngOnInit() {
    this.camCardsFacade.detectCamCardToolbar();
  }

  add(camCard: CamCard) {
    this.addCamCard.emit(camCard);
  }

  addToCart() {
    this.addSelectedItemsToCart.emit();
  }
}
