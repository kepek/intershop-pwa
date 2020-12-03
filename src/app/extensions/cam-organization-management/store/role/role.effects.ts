import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store, select } from '@ngrx/store';
import { iif } from 'rxjs';
import { concatMap, filter, map, withLatestFrom } from 'rxjs/operators';

import { displayErrorMessage, displaySuccessMessage } from 'ish-core/store/core/messages';
import {
  mapErrorToAction,
  mapToPayload,
  mapToPayloadProperty,
  mapToProperty,
  whenTruthy,
} from 'ish-core/utils/operators';

import { CamOrganizationService } from '../../services/cam-organization/cam-organization.service';
import { getSelectedCustomerId, selectCustomer } from '../customer';
import { selectUser } from '../user';

import {
  loadCustomerRoles,
  loadCustomerRolesFail,
  loadCustomerRolesSuccess,
  loadCustomerUserRoles,
  loadCustomerUserRolesFail,
  loadCustomerUserRolesSuccess,
  updateCustomerUserRoles,
  updateCustomerUserRolesFail,
  updateCustomerUserRolesSuccess,
} from './role.actions';

@Injectable()
export class RoleEffects {
  constructor(
    private actions$: Actions,
    private organizationService: CamOrganizationService,
    private store: Store,
    @Inject(PLATFORM_ID) private platformId: string
  ) {}

  // Customer -> Roles

  loadCustomerRolesForSelectedCustomerId$ = createEffect(() =>
    iif(
      () => isPlatformBrowser(this.platformId),
      this.actions$.pipe(
        ofType(selectCustomer),
        mapToPayloadProperty('customerId'),
        whenTruthy(),
        map(customerId => loadCustomerRoles({ customerId }))
      )
    )
  );

  loadCustomerRoles$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadCustomerRoles),
      mapToPayloadProperty('customerId'),
      whenTruthy(),
      concatMap(customerId =>
        this.organizationService.getCustomerRoles(customerId).pipe(
          map(roles => loadCustomerRolesSuccess({ customerId, roles })),
          mapErrorToAction(loadCustomerRolesFail, { customerId })
        )
      )
    )
  );

  // Customer -> User -> Roles

  loadCustomerUserRolesForSelectedCustomerIdAndSelectedUserId$ = createEffect(() =>
    iif(
      () => isPlatformBrowser(this.platformId),
      this.actions$.pipe(
        ofType(selectUser),
        mapToPayloadProperty('userId'),
        whenTruthy(),
        withLatestFrom(this.store.pipe(select(getSelectedCustomerId), whenTruthy())),
        map(([userId, customerId]) => loadCustomerUserRoles({ customerId, userId }))
      )
    )
  );

  loadCustomerUserRoles$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadCustomerUserRoles),
      mapToPayload(),
      concatMap(({ customerId, userId }) =>
        this.organizationService.getCustomerUserRoles(customerId, userId).pipe(
          map(roles => loadCustomerUserRolesSuccess({ customerId, userId, roles })),
          mapErrorToAction(loadCustomerUserRolesFail, { customerId, userId })
        )
      )
    )
  );

  updateCustomerUserRoles$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateCustomerUserRoles),
      mapToPayload(),
      concatMap(({ customerId, userId, roleIDs }) =>
        this.organizationService.updateCustomerUserRoles(customerId, userId, roleIDs).pipe(
          map(roles =>
            updateCustomerUserRolesSuccess({
              customerId,
              userId,
              roles,
              successMessage: 'camfil.account.organization.edit_user.update_customer_user_roles_success.modal.text',
            })
          ),
          mapErrorToAction(updateCustomerUserRolesFail, { customerId, userId })
        )
      )
    )
  );

  // Display Success Message for Updates

  displayUpdateCustomerUserRolesSuccessMessage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateCustomerUserRolesSuccess),
      mapToPayload(),
      mapToProperty('successMessage'),
      filter(successMessage => !!successMessage),
      map(successMessage =>
        displaySuccessMessage({
          message: successMessage,
        })
      )
    )
  );

  // Display Success Message for Updates

  displayUpdateCustomerUserRolesFailMessage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateCustomerUserRolesFail),
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
