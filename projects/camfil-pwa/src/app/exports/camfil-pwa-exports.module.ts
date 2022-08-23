import { NgModule } from '@angular/core';
import { CamfilChannelToggleDirective } from 'camfil-pwa/directives/camfil-channel-toggle.directive';
import { IshCheckoutFacade } from 'camfil-pwa/facades/ish-checkout.facade';
import { IshBasketService } from 'camfil-pwa/services/ish-basket/ish-basket.service';
import { IshOrderService } from 'camfil-pwa/services/ish-order/ish-order.service';
import { IshBasketAddressesEffects } from 'camfil-pwa/store/ish-customer/ish-basket/ish-basket-addresses.effects';
import { IshBasketItemsEffects } from 'camfil-pwa/store/ish-customer/ish-basket/ish-basket-items.effects';
import { IshBasketEffects } from 'camfil-pwa/store/ish-customer/ish-basket/ish-basket.effects';
import { IshOrdersEffects } from 'camfil-pwa/store/ish-customer/ish-orders/ish-orders.effects';
import { IshViewconfEffects } from 'camfil-pwa/store/ish-viewconf/ish-viewconf.effects';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { BasketService } from 'ish-core/services/basket/basket.service';
import { OrderService as OrderService } from 'ish-core/services/order/order.service';
import { ViewconfEffects } from 'ish-core/store/core/viewconf/viewconf.effects';
import { BasketAddressesEffects } from 'ish-core/store/customer/basket/basket-addresses.effects';
import { BasketItemsEffects } from 'ish-core/store/customer/basket/basket-items.effects';
import { BasketEffects } from 'ish-core/store/customer/basket/basket.effects';
import { OrdersEffects } from 'ish-core/store/customer/orders/orders.effects';

@NgModule({
  imports: [],
  declarations: [CamfilChannelToggleDirective],
  exports: [CamfilChannelToggleDirective],
  providers: [
    { provide: BasketAddressesEffects, useClass: IshBasketAddressesEffects },
    { provide: BasketEffects, useClass: IshBasketEffects },
    { provide: BasketItemsEffects, useClass: IshBasketItemsEffects },
    { provide: BasketService, useClass: IshBasketService },
    { provide: CheckoutFacade, useClass: IshCheckoutFacade },
    { provide: OrderService, useClass: IshOrderService },
    { provide: OrdersEffects, useClass: IshOrdersEffects },
    { provide: ViewconfEffects, useClass: IshViewconfEffects },
  ],
})
export class CamfilPwaExportsModule {}
