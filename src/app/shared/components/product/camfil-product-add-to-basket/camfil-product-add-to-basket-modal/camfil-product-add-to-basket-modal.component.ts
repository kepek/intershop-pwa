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
import { ThemePalette } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { take, takeUntil, withLatestFrom } from 'rxjs/operators';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { BasketView } from 'ish-core/models/basket/basket.model';
import { Product } from 'ish-core/models/product/product.model';
import { CamfilSmallCtaModalComponent } from 'ish-shared/components/common/camfil-small-cta-modal/camfil-small-cta-modal.component';

import { AddProductToCartModalComponent } from '../../../../../extensions/cam-cards/shared/add-product-to-cart-modal/add-product-to-cart-modal.component';
import { CamfilConfigurationFacade } from '../../../../../extensions/cam-configuration/facades/camfil-configuration.facade';

@Component({
  selector: 'camfil-product-add-to-basket-modal',
  templateUrl: './camfil-product-add-to-basket-modal.component.html',
  styleUrls: ['./camfil-product-add-to-basket-modal.component.scss'],
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
  @Input() displayType?: 'icon' | 'button' | 'link' = 'icon';
  @Input() hasIcon = false;
  /**
   * additional css styling
   */
  @Input() class?: string;

  @Input() color?: ThemePalette = 'primary';

  @Input() colorIcon?: string;

  /**
   * translationKey for the button label
   */
  @Input() translationKey = 'product.add_to_cart.link';

  basket$: Observable<BasketView>;
  @Input() quantity: number;

  @Output() resetQuantityValue = new EventEmitter<void>();
  @ViewChild(CamfilSmallCtaModalComponent) errorModal: CamfilSmallCtaModalComponent;
  /**
   * fires 'true' after add To Cart is clicked and basket is loading
   */
  displaySpinner$ = new BehaviorSubject(false);
  // tslint:disable-next-line:private-destroy-field
  protected destroy$ = new Subject();

  constructor(
    public dialog: MatDialog,
    protected accountFacade: AccountFacade,
    protected router: Router,
    protected checkoutFacade: CheckoutFacade,
    protected shoppingFacade: ShoppingFacade,
    protected camfilConfigurationFacade: CamfilConfigurationFacade
  ) {}

  get displayIcon(): boolean {
    return this.displayType === 'icon';
  }

  ngOnInit() {
    this.basket$ = this.checkoutFacade.basket$;
  }

  openModal(modal: AddProductToCartModalComponent) {
    this.dialog.open(modal.show(), { maxHeight: '100vh' });
    modal.hide = () => this.dialog.closeAll();
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  openModalIfLoggedIn(modal: AddProductToCartModalComponent) {
    this.accountFacade.isLoggedIn$
      .pipe(
        take(1),
        withLatestFrom(this.camfilConfigurationFacade.isEnabled$('hideAddToBasketLightboxForNonLoggedInUser')),
        takeUntil(this.destroy$)
      )
      .subscribe(([isLoggedIn, hideAddToBasketLightboxForNonLoggedInUser]) => {
        if (isLoggedIn) {
          this.quantity >= this.product?.minOrderQuantity ? this.openModal(modal) : this.openErrorModal();
        } else if (hideAddToBasketLightboxForNonLoggedInUser) {
          this.quantity >= this.product?.minOrderQuantity
            ? this.shoppingFacade.addProductToBasket(this.product.sku, this.quantity)
            : this.openErrorModal();
        } else {
          this.navigateToLogin();
        }
      });
  }

  openErrorModal() {
    const refErrorModalDialog = this.dialog.open(this.errorModal?.show());
    this.errorModal.hide = () => {
      refErrorModalDialog.close();
    };
  }

  resetFormValues() {
    this.resetQuantityValue.emit();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
