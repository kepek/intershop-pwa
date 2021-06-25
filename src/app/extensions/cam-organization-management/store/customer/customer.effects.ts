import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { RouterNavigatedPayload, routerNavigatedAction } from '@ngrx/router-store';
import { Store, select } from '@ngrx/store';
import { iif } from 'rxjs';
import { concatMap, filter, map, mapTo, mergeMap, switchMapTo, withLatestFrom } from 'rxjs/operators';

import { ofUrl, selectPath, selectRouteParam } from 'ish-core/store/core/router';
import { RouterState } from 'ish-core/store/core/router/router.reducer';
import { getUserPermissions } from 'ish-core/store/customer/authorization';
import { getLoggedInCustomer } from 'ish-core/store/customer/user';
import { mapErrorToAction, mapToPayloadProperty, whenTruthy } from 'ish-core/utils/operators';

import { CamOrganizationService } from '../../services/cam-organization/cam-organization.service';
import { loadCustomerRoles } from '../role';
import { loadOrganizationUsers } from '../user';

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

  // Customer -> Route Listener For Customers

  routeListenerForCustomers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(routerNavigatedAction),
      mapToPayloadProperty<RouterNavigatedPayload<RouterState>>('routerState'),
      filter((routerState: RouterState) => /^\/(account\/organization)/.test(routerState.url)),
      mapTo(loadCustomers())
    )
  );

  // Customers - Load Customers

  loadCustomers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadCustomers),
      mergeMap(() =>
        this.organizationService.getCustomers().pipe(
          withLatestFrom(
            this.store.pipe(select(selectPath)),
            this.store.pipe(select(getLoggedInCustomer), whenTruthy()),
            this.store.pipe(select(getUserPermissions))
          ),
          mergeMap(([customers, path, currentCustomer, permissions]) => {
            const actions = [];
            const userAdmin = permissions?.find(p => p === 'APP_B2B_MANAGE_USERS');
            let currentCustomerId = customers.find(c => c.customerNo === currentCustomer.customerNo)?.id;

            if (path.endsWith('account/organization/create') && userAdmin) {
              if (!currentCustomerId) {
                currentCustomerId = customers[0].parentCustomer.id;
                actions.push(loadCustomer({ customerId: currentCustomerId }));
              } else {
                actions.push(loadCustomerRoles({ customerId: currentCustomerId }));
              }
            }
            actions.push(loadCustomersSuccess({ customers }));

            if (customers?.length > 0 && path.endsWith('account/organization')) {
              actions.push(loadOrganizationUsers({ customerIDs: customers.map(c => c.id) }));
            }

            return actions;
          }),
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
