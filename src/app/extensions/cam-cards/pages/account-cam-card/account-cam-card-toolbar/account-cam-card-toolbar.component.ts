import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';

import { CamCardsFacade } from '../../../facades/cam-cards.facade';
import { CamCard } from '../../../models/cam-card/cam-card.model';

@Component({
  selector: 'camfil-account-cam-card-toolbar',
  templateUrl: './account-cam-card-toolbar.component.html',
  styleUrls: ['./account-cam-card-toolbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountCamCardToolbarComponent implements OnInit, OnChanges {
  @Output() addCamCard = new EventEmitter<CamCard>();
  @Output() openMoveCamCardDialog = new EventEmitter<Event>();
  @Output() addSelectedItemsToCart = new EventEmitter();
  @Output() copyCamCard = new EventEmitter<Event>();
  @Input() isSticky: boolean;
  @Input() checkedCamCards: CamCard[];
  @Input() productsChecked = {};
  basketLoading$: Observable<boolean>;
  constructor(private camCardsFacade: CamCardsFacade, private checkoutFacade: CheckoutFacade) {}

  ngOnInit() {
    this.camCardsFacade.detectCamCardToolbar();
    this.basketLoading$ = this.checkoutFacade.basketLoading$;
  }

  ngOnChanges() {
    this.basketLoading$ = this.checkoutFacade.basketLoading$;
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
