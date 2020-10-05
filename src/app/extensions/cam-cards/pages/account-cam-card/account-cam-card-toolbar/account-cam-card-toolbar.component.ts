import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';

import { CamCard } from '../../../models/cam-card/cam-card.model';

@Component({
  selector: 'camfil-account-cam-card-toolbar',
  templateUrl: './account-cam-card-toolbar.component.html',
  styleUrls: ['./account-cam-card-toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountCamCardToolbarComponent {
  @Output() addCamCard = new EventEmitter<CamCard>();
  @Output() addSelectedItemsToCart = new EventEmitter();

  add(camCard: CamCard) {
    this.addCamCard.emit(camCard);
  }

  addToCart() {
    this.addSelectedItemsToCart.emit();
  }
}
