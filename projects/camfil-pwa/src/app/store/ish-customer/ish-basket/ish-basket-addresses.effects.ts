import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { IshBasketService } from 'camfil-pwa/services/ish-basket/ish-basket.service';
import { EMPTY } from 'rxjs';
import { concatMapTo, mergeMap, withLatestFrom } from 'rxjs/operators';

import { Address } from 'ish-core/models/address/address.model';
import { AddressService } from 'ish-core/services/address/address.service';
import { BasketService } from 'ish-core/services/basket/basket.service';
import {
  deleteCustomerAddressFail,
  deleteCustomerAddressSuccess,
  updateCustomerAddressFail,
  updateCustomerAddressSuccess,
} from 'ish-core/store/customer/addresses';
import {
  deleteBasketShippingAddress,
  getCurrentBasketId,
  loadBasketAddresses,
  loadBasketAddressesFail,
  loadBasketAddressesSuccess,
  resetBasketErrors,
  updateBasketAddress,
} from 'ish-core/store/customer/basket';
import { BasketAddressesEffects } from 'ish-core/store/customer/basket/basket-addresses.effects';
import { getLoggedInCustomer } from 'ish-core/store/customer/user';
import { mapErrorToAction, mapToPayload, mapToPayloadProperty } from 'ish-core/utils/operators';

import { camfilUpdateBasketAddress, camfilUpdateBasketAddressFail, reloadBasket } from './ish-basket.actions';

@Injectable()
export class IshBasketAddressesEffects extends BasketAddressesEffects {
  constructor(
    actions$: Actions,
    store: Store,
    basketService: BasketService,
    addressService: AddressService,
    private ishActions$: Actions,
    private ishStore: Store,
    private ishAddressService: AddressService,
    private ishBasketService: IshBasketService
  ) {
    super(actions$, store, basketService, addressService);
  }
  updateBasketAddress$ = createEffect(() =>
    this.ishActions$.pipe(
      ofType(updateBasketAddress),
      mapToPayload(),
      withLatestFrom(this.ishStore.pipe(select(getLoggedInCustomer))),
      mergeMap(([payload, customer]) => {
        const { address } = payload;

        // create address at customer for logged in user
        if (customer && !payload.isBasket) {
          return this.ishAddressService
            .updateCustomerAddress('-', address)
            .pipe(
              concatMapTo([updateCustomerAddressSuccess({ address }), reloadBasket(), resetBasketErrors()]),
              mapErrorToAction(updateCustomerAddressFail)
            );
          // create address at basket for anonymous user
        } else {
          return this.ishBasketService
            .updateBasketAddress(address)
            .pipe(
              concatMapTo([
                updateCustomerAddressSuccess({ address }),
                reloadBasket(),
                resetBasketErrors(),
                loadBasketAddresses(),
              ]),
              mapErrorToAction(updateCustomerAddressFail)
            );
        }
      })
    )
  );
  deleteBasketShippingAddress$ = createEffect(() =>
    this.ishActions$.pipe(
      ofType(deleteBasketShippingAddress),
      mapToPayloadProperty('addressId'),
      mergeMap(addressId =>
        this.ishAddressService
          .deleteCustomerAddress('-', addressId)
          .pipe(
            concatMapTo([deleteCustomerAddressSuccess({ addressId }), reloadBasket()]),
            mapErrorToAction(deleteCustomerAddressFail)
          )
      )
    )
  );
  camfilUpdateBasketAddress$ = createEffect(() =>
    this.ishActions$.pipe(
      ofType(camfilUpdateBasketAddress),
      mapToPayload(),
      mergeMap(payload => {
        const { address } = payload;
        return this.ishBasketService
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
  loadBasketAddresses$ = createEffect(() =>
    this.ishActions$.pipe(
      ofType(loadBasketAddresses),
      withLatestFrom(this.ishStore.pipe(select(getCurrentBasketId))),
      mergeMap(([, basket]) =>
        basket
          ? this.ishBasketService.getBasketAddresses().pipe(
              mergeMap((basketAddresses: Address[]) => [loadBasketAddressesSuccess({ basketAddresses })]),
              mapErrorToAction(loadBasketAddressesFail)
            )
          : EMPTY
      )
    )
  );
}
