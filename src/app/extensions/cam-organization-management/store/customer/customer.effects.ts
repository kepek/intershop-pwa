import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { routerNavigatedAction } from '@ngrx/router-store';
import { Store, select } from '@ngrx/store';
import { iif } from 'rxjs';
import { concatMap, filter, map, mergeMap, switchMapTo, withLatestFrom } from 'rxjs/operators';

import { ofUrl, selectRouteParam } from 'ish-core/store/core/router';
import { mapErrorToAction, mapToPayloadProperty, whenTruthy } from 'ish-core/utils/operators';

import { CamOrganizationService } from '../../services/cam-organization/cam-organization.service';

import {
  loadCustomer,
  loadCustomerFail,
  loadCustomerSuccess,
  loadCustomers,
  loadCustomersFail,
  loadCustomersSuccess,
  selectCustomer,
} from './customer.actions';
import { getSelectedCustomerId } from './customer.selectors';

@Injectable()
export class CustomerEffects {
  constructor(
    private actions$: Actions,
    private organizationService: CamOrganizationService,
    private store: Store,
    @Inject(PLATFORM_ID) private platformId: string
  ) {}

  // Customers - Load Customers

  loadCustomers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadCustomers),
      mergeMap(() =>
        this.organizationService.getCustomers().pipe(
          map(customers => loadCustomersSuccess({ customers })),
          mapErrorToAction(loadCustomersFail)
        )
      )
    )
  );

  // Customer -> Route Listener For Selecting Customer

  routeListenerForSelectingCustomer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(routerNavigatedAction),
      switchMapTo(
        this.store.pipe(
          ofUrl(/^\/(account\/organization\/customers\/.*)/),
          select(selectRouteParam('CamfilB2BCustomerId')),
          withLatestFrom(this.store.pipe(select(getSelectedCustomerId))),
          filter(([fromAction, selectedCustomerId]) => fromAction && fromAction !== selectedCustomerId),
          map(([customerId]) => customerId),
          map(customerId => selectCustomer({ customerId }))
        )
      )
    )
  );

  // Customer -> Load Selected Customer

  loadCustomerForSelectedCustomerId$ = createEffect(() =>
    iif(
      () => isPlatformBrowser(this.platformId),
      this.actions$.pipe(
        ofType(selectCustomer),
        mapToPayloadProperty('customerId'),
        whenTruthy(),
        map(customerId => loadCustomer({ customerId }))
      )
    )
  );

  // Customer -> Load Customer

  loadCustomer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadCustomer),
      mapToPayloadProperty('customerId'),
      concatMap(customerId =>
        this.organizationService.getCustomer(customerId).pipe(
          map(customer => loadCustomerSuccess({ customer })),
          mapErrorToAction(loadCustomerFail, { customerId })
        )
      )
    )
  );
}
