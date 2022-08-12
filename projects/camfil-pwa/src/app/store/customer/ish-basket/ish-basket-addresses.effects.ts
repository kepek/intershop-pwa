import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { concatMapTo, mergeMap } from 'rxjs/operators';

import { AddressService } from 'ish-core/services/address/address.service';
import { BasketService } from 'ish-core/services/basket/basket.service';
import { updateCustomerAddressSuccess } from 'ish-core/store/customer/addresses';
import { loadBasketAddresses, reloadBasket, resetBasketErrors } from 'ish-core/store/customer/basket';
import { BasketAddressesEffects } from 'ish-core/store/customer/basket/basket-addresses.effects';
import { mapErrorToAction, mapToPayload } from 'ish-core/utils/operators';

import { camfilUpdateBasketAddress, camfilUpdateBasketAddressFail } from './ish-basket.actions';

@Injectable()
export class IshBasketAddressesEffects extends BasketAddressesEffects {
  constructor(actions$: Actions, store: Store, basketService: BasketService, addressService: AddressService) {
    super(actions$, store, basketService, addressService);
  }

  camfilUpdateBasketAddress$ = createEffect(() =>
    this.actions$.pipe(
      ofType(camfilUpdateBasketAddress),
      mapToPayload(),
      mergeMap(payload => {
        const { address } = payload;
        return this.basketService
          .updateBasketAddress(address)
          .pipe(
            concatMapTo([
              updateCustomerAddressSuccess({ address }),
              reloadBasket(),
              resetBasketErrors(),
              loadBasketAddresses(),
            ]),
            mapErrorToAction(camfilUpdateBasketAddressFail)
          );
      })
    )
  );
}
