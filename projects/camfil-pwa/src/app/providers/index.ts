// tslint:disable: project-structure ish-ordered-imports
import { OrderService as IshOrderService } from 'ish-core/services/order/order.service';
import { OrderService as CamfilOrderService } from 'camfil-pwa/services/order/order.service';

import { CheckoutFacade as IshCheckoutFacade } from 'ish-core/facades/checkout.facade';
import { CheckoutFacade as CamfilCheckoutFacade } from 'camfil-pwa/facades/checkout.facade';

export default [
  { provide: IshOrderService, useClass: CamfilOrderService },
  { provide: IshCheckoutFacade, useClass: CamfilCheckoutFacade },
];
