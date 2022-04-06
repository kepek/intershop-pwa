import { Injectable } from '@angular/core';
import { createEffect, ofType } from '@ngrx/effects';
import { concatMapTo, mergeMap } from 'rxjs/operators';

import { updateCustomerAddressSuccess } from 'ish-core/store/customer/addresses';
import { loadBasket, loadBasketAddresses, resetBasketErrors } from 'ish-core/store/customer/basket';
import { BasketAddressesEffects } from 'ish-core/store/customer/basket/basket-addresses.effects';
import { mapErrorToAction, mapToPayload } from 'ish-core/utils/operators';

import { camfilUpdateBasketAddress, camfilUpdateBasketAddressFail } from './ish-basket.actions';

@Injectable()
export class IshBasketAddressesEffects extends BasketAddressesEffects {
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
              loadBasket(),
              resetBasketErrors(),
              loadBasketAddresses(),
            ]),
            mapErrorToAction(camfilUpdateBasketAddressFail)
          );
      })
    )
  );
}
