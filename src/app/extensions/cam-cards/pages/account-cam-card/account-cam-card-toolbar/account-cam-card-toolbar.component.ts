import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';

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
  @Output() addSelectedItemsToCart = new EventEmitter();
  @Output() copyCamCard = new EventEmitter<Event>();
  @Input() isSticky: boolean;
  @Input() checkedCamCards: CamCard[];
  @Input() productsChecked = {};
  basketLoading = false;
  @Input() productAddingInProgress: boolean;

  private destroy$ = new Subject<void>();

  constructor(private camCardsFacade: CamCardsFacade, private checkoutFacade: CheckoutFacade) {}

  ngOnInit() {
    this.camCardsFacade.detectCamCardToolbar();
    this.checkoutFacade.basketLoading$.pipe(takeUntil(this.destroy$)).subscribe(bl => {
      this.basketLoading = bl;
    });
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

  isAddToCartBtnDisabled() {
    return this.basketLoading || !this.isProductsChecked() || this.productAddingInProgress;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
