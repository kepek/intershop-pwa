import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';

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
  // @Output() addSelectedItemsToCart = new EventEmitter();
  @Input() isSticky: boolean;
  @Input() title: string;

  constructor(private camCardsFacade: CamCardsFacade) {}

  ngOnInit() {
    this.camCardsFacade.detectCamCardToolbar();
  }

  // add(camCard: CamCard) {
  //   this.addCamCard.emit(camCard);
  // }

  // move(event: Event) {
  //   this.openMoveCamCardDialog.emit(event);
  // }

  // addToCart() {
  //   this.addSelectedItemsToCart.emit();
  // }
}
