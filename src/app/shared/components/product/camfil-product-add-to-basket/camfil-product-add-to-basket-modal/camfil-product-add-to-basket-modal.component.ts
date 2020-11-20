import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
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

  basket$: Observable<BasketView>;

  private destroy$ = new Subject();

  constructor(
    public dialog: MatDialog,
    private accountFacade: AccountFacade,
    private router: Router,
    private checkoutFacade: CheckoutFacade
  ) {}

  ngOnInit() {
    this.basket$ = this.checkoutFacade.basket$;
    /*    this.basket$.pipe(whenTruthy(), takeUntil(this.destroy$)).subscribe(basket => {
      console.log('CamfilProductAddToBasketModalComponent basket', basket);
    });*/
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

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
