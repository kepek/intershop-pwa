import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { routerNavigatedAction } from '@ngrx/router-store';
import { Store, select } from '@ngrx/store';
import { iif } from 'rxjs';
import { concatMap, filter, map, mergeMap, switchMap, switchMapTo, withLatestFrom } from 'rxjs/operators';

import { displayErrorMessage, displaySuccessMessage } from 'ish-core/store/core/messages';
import { ofUrl, selectRouteParam } from 'ish-core/store/core/router';
import { mapErrorToAction, mapToPayload, mapToPayloadProperty, whenTruthy } from 'ish-core/utils/operators';

import { CamOrganizationService } from '../../services/cam-organization/cam-organization.service';
import { getSelectedCustomerId } from '../customer';

import {
  activateCustomerUser,
  activateCustomerUserFail,
  activateCustomerUserSuccess,
  createCustomerUser,
  createCustomerUserFail,
  createCustomerUserSuccess,
  deactivateCustomerUser,
  deactivateCustomerUserFail,
  deactivateCustomerUserSuccess,
  loadCustomerUser,
  loadCustomerUserFail,
  loadCustomerUserSuccess,
  loadCustomerUsers,
  loadCustomerUsersFail,
  loadCustomerUsersSuccess,
  resetCustomerUserPassword,
  resetCustomerUserPasswordFail,
  resetCustomerUserPasswordSuccess,
  selectUser,
  updateCustomerUser,
  updateCustomerUserFail,
  updateCustomerUserSuccess,
} from './user.actions';
import { getSelectedUserId } from './user.selectors';

@Injectable()
export class UserEffects {
  constructor(
    private actions$: Actions,
    private organizationService: CamOrganizationService,
    private store: Store,
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

  // Customer -> User -> Load Customer User for Select CustomerID and UserID (browser only)

  loadCustomerUserForSelectedCustomerIdAndSelectedUserId$ = createEffect(() =>
    iif(
      () => isPlatformBrowser(this.platformId),
      this.actions$.pipe(
        ofType(selectUser),
        mapToPayloadProperty('userId'),
        whenTruthy(),
        withLatestFrom(this.store.pipe(select(getSelectedCustomerId), whenTruthy())),
        map(([userId, customerId]) => loadCustomerUser({ customerId, userId }))
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

  // Create Customer User

  createCustomerUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createCustomerUser),
      mapToPayload(),
      concatMap(({ customer, user }) =>
        this.organizationService.updateCustomerUser(customer, user).pipe(
          map(changedUser =>
            createCustomerUserSuccess({
              customer,
              user: changedUser,
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
      concatMap(({ customerId, userId, email }) =>
        this.organizationService.resetCustomerUserPassword(customerId, userId, email).pipe(
          map(() =>
            resetCustomerUserPasswordSuccess({
              customerId,
              userId,
              email,
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
        resetCustomerUserPasswordSuccess
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

  // Display Success Message for Updates

  displayUpdateCustomerUserFailMessage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        activateCustomerUserFail,
        deactivateCustomerUserFail,
        updateCustomerUserFail,
        resetCustomerUserPasswordFail
      ),
      mapToPayloadProperty('error'),
      filter(error => !!error?.message),
      map(error =>
        displayErrorMessage({
          message: error?.message,
        })
      )
    )
  );
}
