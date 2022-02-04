import { NgModule } from '@angular/core';
import { CheckoutFacade as CamfilCheckoutFacade } from 'camfil-pwa/facades/checkout.facade';
import { OrderService as CamfilOrderService } from 'camfil-pwa/services/order/order.service';
import { OrdersEffects } from 'camfil-pwa/store/customer/orders/orders.effects';

import { CheckoutFacade as IshCheckoutFacade } from 'ish-core/facades/checkout.facade';
import { OrderService as IshOrderService } from 'ish-core/services/order/order.service';
import { OrdersEffects as IshOrderEffects } from 'ish-core/store/customer/orders/orders.effects';

@NgModule({
  imports: [],
  declarations: [],
  exports: [],
  providers: [
    { provide: IshOrderService, useClass: CamfilOrderService },
    { provide: IshCheckoutFacade, useClass: CamfilCheckoutFacade },
    { provide: IshOrderEffects, useClass: OrdersEffects },
  ],
})
export class CamfilPwaExportsModule {}
