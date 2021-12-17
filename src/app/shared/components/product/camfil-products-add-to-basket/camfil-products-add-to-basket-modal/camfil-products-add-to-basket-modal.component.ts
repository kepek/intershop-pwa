// tslint:disable: ish-ordered-imports ban-specific-imports
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { take, takeUntil } from 'rxjs/operators';

import { AccountFacade } from 'ish-core/facades/account.facade';
import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { CamfilProductAddToBasketModalComponent } from 'ish-shared/components/product/camfil-product-add-to-basket/camfil-product-add-to-basket-modal/camfil-product-add-to-basket-modal.component';

import { AddProductsToCartModalComponent } from '../../../../../extensions/cam-cards/shared/add-products-to-cart-modal/add-products-to-cart-modal.component';
import { ProductItem } from 'ish-core/models/product/product-item';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { ConfigurationService } from 'src/app/extensions/cam-configuration/services/configuration/configuration.service';

@Component({
  selector: 'camfil-products-add-to-basket-modal',
  templateUrl: './camfil-products-add-to-basket-modal.component.html',
  styleUrls: ['./camfil-products-add-to-basket-modal.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
// tslint:disable-next-line:component-creation-test
export class CamfilProductsAddToBasketModalComponent extends CamfilProductAddToBasketModalComponent {
  constructor(
    public dialog: MatDialog,
    protected accountFacade: AccountFacade,
    protected router: Router,
    protected checkoutFacade: CheckoutFacade,
    protected shoppingFacade: ShoppingFacade,
    protected configuration: ConfigurationService
  ) {
    super(dialog, accountFacade, router, checkoutFacade, shoppingFacade, configuration);
  }

  @Input() products: ProductItem[];

  openModal(modal: AddProductsToCartModalComponent) {
    this.dialog.open(modal.show());
    modal.hide = () => this.dialog.closeAll();
  }

  openModalIfLoggedIn(modal: AddProductsToCartModalComponent) {
    this.accountFacade.isLoggedIn$.pipe(take(1), takeUntil(this.destroy$)).subscribe(isLoggedIn => {
      if (isLoggedIn) {
        this.openModal(modal);
      } else {
        this.navigateToLogin();
      }
    });
  }
}
