import { NgModule } from '@angular/core';
import { CamfilChannelToggleDirective } from 'camfil-pwa/directives/camfil-channel-toggle.directive';
import { CamfilShoppingFacade } from 'camfil-pwa/facades/camfil-shopping.facade';
import { CheckoutFacade as CamfilCheckoutFacade } from 'camfil-pwa/facades/checkout.facade';
import { CamfilProductMapper } from 'camfil-pwa/models/camfil-product/camfil-product.mapper';
import { OrderService as CamfilOrderService } from 'camfil-pwa/services/ish-order/order.service';
import { IshProductsService } from 'camfil-pwa/services/ish-products/ish-products.service';
import { CamfilProductsEffects } from 'camfil-pwa/store/camfil-shopping/camfil-products/camfil-products.effects';
import { IshBasketAddressesEffects } from 'camfil-pwa/store/customer/ish-basket/ish-basket-addresses.effects';
import { IshBasketItemsEffects } from 'camfil-pwa/store/customer/ish-basket/ish-basket-items.effects';
import { OrdersEffects as CamfilOrderEffects } from 'camfil-pwa/store/customer/orders/orders.effects';
import { ViewconfEffects as CamfilViewconfEffects } from 'camfil-pwa/store/viewconf/viewconf.effects';

import { CheckoutFacade as IshCheckoutFacade } from 'ish-core/facades/checkout.facade';
import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { ProductMapper } from 'ish-core/models/product/product.mapper';
import { OrderService as IshOrderService } from 'ish-core/services/order/order.service';
import { ProductsService } from 'ish-core/services/products/products.service';
import { ViewconfEffects as IshViewconfEffects } from 'ish-core/store/core/viewconf/viewconf.effects';
import { BasketAddressesEffects } from 'ish-core/store/customer/basket/basket-addresses.effects';
import { BasketItemsEffects } from 'ish-core/store/customer/basket/basket-items.effects';
import { OrdersEffects as IshOrderEffects } from 'ish-core/store/customer/orders/orders.effects';
import { ProductsEffects } from 'ish-core/store/shopping/products/products.effects';

@NgModule({
  imports: [],
  declarations: [CamfilChannelToggleDirective],
  exports: [CamfilChannelToggleDirective],
  providers: [
    { provide: IshOrderService, useClass: CamfilOrderService },
    { provide: IshCheckoutFacade, useClass: CamfilCheckoutFacade },
    { provide: IshOrderEffects, useClass: CamfilOrderEffects },
    { provide: BasketAddressesEffects, useClass: IshBasketAddressesEffects },
    { provide: BasketItemsEffects, useClass: IshBasketItemsEffects },
    { provide: IshViewconfEffects, useClass: CamfilViewconfEffects },
    { provide: ShoppingFacade, useClass: CamfilShoppingFacade },
    { provide: ProductsService, useClass: IshProductsService },
    { provide: ProductsEffects, useClass: CamfilProductsEffects },
    { provide: ProductMapper, useClass: CamfilProductMapper },
  ],
})
export class CamfilPwaExportsModule {}
