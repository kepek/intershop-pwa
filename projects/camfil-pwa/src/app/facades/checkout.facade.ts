// tslint:disable: ish-ordered-imports project-structure
import { CheckoutFacade as IshCheckoutFacade } from 'ish-core/facades/checkout.facade';
import { getOrder, loadOrder } from 'ish-core/store/customer/orders';
import { select } from '@ngrx/store';
import { Injectable } from '@angular/core';
import { Address } from 'ish-core/models/address/address.model';
import { camfilUpdateBasketAddress } from 'camfil-pwa/store/customer/ish-basket/ish-basket.actions';

@Injectable({ providedIn: 'root' })
export class CheckoutFacade extends IshCheckoutFacade {
  loadOrder$(orderId: string) {
    this.store.dispatch(loadOrder({ orderId }));
    return this.store.pipe(select(getOrder, { orderId }));
  }

  camfilUpdateBasketAddress(address: Address, isBasket?: boolean) {
    this.store.dispatch(camfilUpdateBasketAddress({ address, isBasket }));
  }
}
