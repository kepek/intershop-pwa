import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { BasketView } from 'ish-core/models/basket/basket.model';
import { Product } from 'ish-core/models/product/product.model';

import { AddToCartModalComponent } from '../../../../../extensions/cam-cards/shared/add-to-cart-modal/add-to-cart-modal.component';

@Component({
  selector: 'camfil-product-add-to-basket-modal',
  templateUrl: './camfil-product-add-to-basket-modal.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CamfilProductAddToBasketModalComponent implements OnInit, OnDestroy {
  @Input() product: Product;
  /**
   * When true, it specifies that the button should be disabled
   */
  @Input() disabled = false;
  /**
   * when 'icon', the button label is an icon, otherwise it is text
   */
  @Input() displayType?: 'icon' | 'button' | 'link' = 'link';
  /**
   * additional css styling
   */
  @Input() class?: string;

  @Input() colorIcon?: string;

  /**
   * translationKey for the button label
   */
  @Input() translationKey = 'product.add_to_cart.link';

  basket$: Observable<BasketView>;

  private destroy$ = new Subject();

  constructor(
    public dialog: MatDialog,
    private accountFacade: AccountFacade,
    private router: Router,
    private checkoutFacade: CheckoutFacade
  ) {}

  /**
   * fires 'true' after add To Cart is clicked and basket is loading
   */
  displaySpinner$ = new BehaviorSubject(false);

  ngOnInit() {
    this.basket$ = this.checkoutFacade.basket$;
  }

  openModal(modal: AddToCartModalComponent) {
    this.dialog.open(modal.show());
    modal.hide = () => this.dialog.closeAll();
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  openModalIfLoggedIn(modal: AddToCartModalComponent) {
    this.accountFacade.isLoggedIn$.pipe(take(1), takeUntil(this.destroy$)).subscribe(isLoggedIn => {
      if (isLoggedIn) {
        this.openModal(modal);
      } else {
        this.navigateToLogin();
      }
    });
  }

  get displayIcon(): boolean {
    return this.displayType === 'icon';
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
