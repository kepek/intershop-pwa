import { NgModule } from '@angular/core';
import { CamfilChannelToggleDirective } from 'camfil-pwa/directives/camfil-channel-toggle.directive';
import { CheckoutFacade as CamfilCheckoutFacade } from 'camfil-pwa/facades/checkout.facade';
import { OrderService as CamfilOrderService } from 'camfil-pwa/services/order/order.service';
import { OrdersEffects as CamfilOrderEffects } from 'camfil-pwa/store/customer/orders/orders.effects';

import { CheckoutFacade as IshCheckoutFacade } from 'ish-core/facades/checkout.facade';
import { OrderService as IshOrderService } from 'ish-core/services/order/order.service';
import { OrdersEffects as IshOrderEffects } from 'ish-core/store/customer/orders/orders.effects';

@NgModule({
  imports: [],
  declarations: [CamfilChannelToggleDirective],
  exports: [CamfilChannelToggleDirective],
  providers: [
    { provide: IshOrderService, useClass: CamfilOrderService },
    { provide: IshCheckoutFacade, useClass: CamfilCheckoutFacade },
    { provide: IshOrderEffects, useClass: CamfilOrderEffects },
  ],
})
export class CamfilPwaExportsModule {}
