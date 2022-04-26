import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { routerNavigatedAction } from '@ngrx/router-store';
import { Store, select } from '@ngrx/store';
import { CamfilLoginOnBehalfQueryParams } from 'camfil-pwa/identity-provider/camfil-login-on-behalf-identity-provider';
import { iif, of } from 'rxjs';
import {
  concatMap,
  filter,
  first,
  map,
  mergeMap,
  switchMap,
  switchMapTo,
  take,
  tap,
  withLatestFrom,
} from 'rxjs/operators';

import { displayErrorMessage, displaySuccessMessage } from 'ish-core/store/core/messages';
import { ofUrl, selectRouteParam } from 'ish-core/store/core/router';
import { loadBasketSuccess, updateBasketExternalOrderReference } from 'ish-core/store/customer/basket';
import { getUserAuthorized } from 'ish-core/store/customer/user';
import { mapErrorToAction, mapToPayload, mapToPayloadProperty, whenTruthy } from 'ish-core/utils/operators';

import { CamOrganizationService } from '../../services/cam-organization/cam-organization.service';

import {
  activateCustomerUser,
  activateCustomerUserFail,
  activateCustomerUserSuccess,
  connectContactWithUserAndCustomerFail,
  connectContactWithUserAndCustomerSuccess,
  createCustomerUser,
  createCustomerUserFail,
  createCustomerUserSuccess,
  deactivateCustomerUser,
  deactivateCustomerUserFail,
  deactivateCustomerUserSuccess,
  disconnectUserFromCustomer,
  disconnectUserFromCustomerFail,
  disconnectUserFromCustomerSuccess,
  loadCustomerUser,
  loadCustomerUserFail,
  loadCustomerUserSuccess,
  loadCustomerUsers,
  loadCustomerUsersFail,
  loadCustomerUsersSuccess,
  loadOrganizationUsers,
  loadOrganizationUsersFail,
  loadOrganizationUsersSuccess,
  resetCustomerUserPassword,
  resetCustomerUserPasswordFail,
  resetCustomerUserPasswordSuccess,
  selectUser,
  updateCustomerUser,
  updateCustomerUserFail,
  updateCustomerUserSuccess,
} from './user.actions';
import { getSelectedUserId, getUser } from './user.selectors';

@Injectable()
export class UserEffects {
  constructor(
    private actions$: Actions,
    private organizationService: CamOrganizationService,
    private store: Store,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: string
  ) {}

  // Customer -> Users -> Load

  loadCustomerUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadCustomerUsers),
      mapToPayloadProperty('customerId'),
      whenTruthy(),
      mergeMap(customerId =>
        this.organizationService.getCustomerUsers(customerId).pipe(
          map(users => loadCustomerUsersSuccess({ customerId, users })),
          mapErrorToAction(loadCustomerUsersFail)
        )
      )
    )
  );

  // Customer -> User -> Route Listener For Selecting User

  routeListenerForSelectingUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(routerNavigatedAction),
      switchMapTo(
        this.store.pipe(
          ofUrl(/^\/(account\/organization\/customers\/.*\/users\/.*)/),
          select(selectRouteParam('CamfilB2BUserId')),
          withLatestFrom(this.store.pipe(select(getSelectedUserId))),
          filter(([fromAction, selectedUserId]) => fromAction && fromAction !== selectedUserId),
          map(([userId]) => userId),
          map(userId => selectUser({ userId }))
        )
      )
    )
  );

  // Customer -> User -> Load Customer User for Selected CustomerID and UserID (browser only)

  loadCustomerUserForSelectedCustomerIdAndSelectedUserId$ = createEffect(() =>
    iif(
      () => isPlatformBrowser(this.platformId),
      this.actions$.pipe(
        ofType(selectUser),
        mapToPayloadProperty('userId'),
        whenTruthy(),
        switchMap(userId => this.store.pipe(select(getUser(userId)), whenTruthy(), first())),
        map(user => loadCustomerUser({ customerId: user.customers[0].id, userId: user.id }))
      )
    )
  );

  // Customer -> User -> Load Customer User

  loadCustomerUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadCustomerUser),
      mapToPayload(),
      concatMap(({ customerId, userId }) =>
        this.organizationService.getCustomerUser(customerId, userId).pipe(
          map(user => loadCustomerUserSuccess({ customerId, user })),
          mapErrorToAction(loadCustomerUserFail, { customerId, userId })
        )
      )
    )
  );

  // Customer -> User -> Activate

  activateCustomerUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(activateCustomerUser),
      mapToPayload(),
      switchMap(({ customerId, userId }) =>
        this.organizationService.updateCustomerUserActiveFlag(customerId, userId, true).pipe(
          map(active =>
            activateCustomerUserSuccess({
              customerId,
              userId,
              active,
              successMessage: 'camfil.account.organization.edit_user.unlock_user.modal.text',
            })
          ),
          mapErrorToAction(activateCustomerUserFail, { customerId, userId, value: true })
        )
      )
    )
  );

  // Customer -> User -> Deactivate

  deactivateCustomerUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deactivateCustomerUser),
      mapToPayload(),
      switchMap(({ customerId, userId }) =>
        this.organizationService.updateCustomerUserActiveFlag(customerId, userId, false).pipe(
          map(active =>
            deactivateCustomerUserSuccess({
              customerId,
              userId,
              active,
              successMessage: 'camfil.account.organization.edit_user.lock_user.modal.text',
            })
          ),
          mapErrorToAction(deactivateCustomerUserFail, { customerId, userId, value: false })
        )
      )
    )
  );

  // Update Customer User

  updateCustomerUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateCustomerUser),
      mapToPayload(),
      concatMap(({ customer, user }) =>
        this.organizationService.updateCustomerUser(customer, user).pipe(
          map(changedUser =>
            updateCustomerUserSuccess({
              customer,
              user: changedUser,
              successMessage: 'camfil.account.organization.user_details.form.update.success.message',
            })
          ),
          mapErrorToAction(updateCustomerUserFail)
        )
      )
    )
  );

  // tslint:disable:no-commented-out-code
  // redirectAfterUpdateCustomerUser$ = createEffect(
  //   () =>
  //     this.actions$.pipe(
  //       ofType(updateCustomerUser),
  //       tap(() => {
  //         this.navigateTo('../');
  //       })
  //     ),
  //   { dispatch: false }
  // );

  // Create Customer User

  createCustomerUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createCustomerUser),
      mapToPayload(),
      mergeMap(({ customer, user, contacts, roles }) =>
        this.organizationService.createCustomerUser(customer, user, contacts, roles).pipe(
          tap(createdUser => {
            const customerId = contacts[0].customer?.parentCustomer?.id || contacts[0].customer.id;
            this.navigateTo(`../customers/${customerId}/users/${createdUser.id}`);
          }),
          map(createdUser =>
            createCustomerUserSuccess({
              customer,
              user: createdUser,
              successMessage: 'camfil.account.organization.user_details.form.update.success.message',
            })
          ),
          mapErrorToAction(createCustomerUserFail)
        )
      )
    )
  );

  // Reset Customer User Password

  resetCustomerUserPassword$ = createEffect(() =>
    this.actions$.pipe(
      ofType(resetCustomerUserPassword),
      mapToPayload(),
      concatMap(({ customerId, userId, login }) =>
        this.organizationService.resetCustomerUserPassword(customerId, userId, login).pipe(
          map(() =>
            resetCustomerUserPasswordSuccess({
              customerId,
              userId,
              login,
              successMessage: 'camfil.account.organization.user_details.form.change_password.success.message',
            })
          ),
          mapErrorToAction(resetCustomerUserPasswordFail)
        )
      )
    )
  );

  // Display Success Message for Updates

  displayUpdateCustomerUserSuccessMessage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        activateCustomerUserSuccess,
        deactivateCustomerUserSuccess,
        updateCustomerUserSuccess,
        resetCustomerUserPasswordSuccess,
        createCustomerUserSuccess,
        disconnectUserFromCustomerSuccess,
        connectContactWithUserAndCustomerSuccess
      ),
      mapToPayloadProperty('successMessage'),
      filter(successMessage => !!successMessage),
      map(successMessage =>
        displaySuccessMessage({
          message: successMessage,
        })
      )
    )
  );

  // Display Fail Message for Updates

  displayUpdateCustomerUserFailMessage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        activateCustomerUserFail,
        deactivateCustomerUserFail,
        updateCustomerUserFail,
        resetCustomerUserPasswordFail,
        createCustomerUserFail,
        disconnectUserFromCustomerFail,
        connectContactWithUserAndCustomerFail
      ),
      mapToPayloadProperty('error'),
      whenTruthy(),
      map(error =>
        displayErrorMessage({
          message: error?.message || error?.code,
        })
      )
    )
  );

  // Customer -> User -> Disconnect

  disconnectUserFromCustomer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(disconnectUserFromCustomer),
      mapToPayload(),
      switchMap(({ customerId, userId }) =>
        this.organizationService.disconnectUserFromCustomerPlusReload(customerId, userId).pipe(
          map(user =>
            disconnectUserFromCustomerSuccess({
              customerId,
              userId,
              user,
              successMessage: 'camfil.account.organization.edit_user.disconnect_user_from_customer.modal.text',
            })
          ),
          mapErrorToAction(disconnectUserFromCustomerFail, { customerId, userId })
        )
      )
    )
  );

  // Organization - Load Users

  loadOrganizationUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadOrganizationUsers),
      mapToPayload(),
      switchMap(({ customerIDs }) =>
        this.organizationService.getOrganizationUsers(customerIDs).pipe(
          map(users =>
            loadOrganizationUsersSuccess({
              customerIDs,
              users,
            })
          ),
          mapErrorToAction(loadOrganizationUsersFail, { customerIDs })
        )
      )
    )
  );

  updateBasketExternalOrderReferenceAfterLogin$ = createEffect(() =>
    iif(
      () => isPlatformBrowser(this.platformId),
      this.actions$.pipe(
        ofType(loadBasketSuccess),
        mapToPayloadProperty('basket'),
        take(1),
        withLatestFrom(
          this.store.pipe(select(getUserAuthorized)),
          of(window?.localStorage?.getItem(CamfilLoginOnBehalfQueryParams.ERPEmployeeID) || undefined)
        ),
        filter(
          ([basket, authorized, externalOrderReference]) =>
            authorized && basket?.externalOrderReference !== externalOrderReference
        ),
        map(([, , externalOrderReference]) => updateBasketExternalOrderReference({ externalOrderReference }))
      )
    )
  );

  private navigateTo(path: string): void {
    let currentRoute = this.router.routerState.root;

    while (currentRoute.firstChild) {
      currentRoute = currentRoute.firstChild;
    }

    this.router.navigate([path], { relativeTo: currentRoute });
  }
}
