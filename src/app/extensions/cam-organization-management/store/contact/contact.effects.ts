import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { iif } from 'rxjs';
import { concatMap, filter, map, switchMap } from 'rxjs/operators';

import { displayErrorMessage, displaySuccessMessage } from 'ish-core/store/core/messages';
import {
  mapErrorToAction,
  mapToPayload,
  mapToPayloadProperty,
  mapToProperty,
  whenTruthy,
} from 'ish-core/utils/operators';

import { CamOrganizationService } from '../../services/cam-organization/cam-organization.service';
import { selectCustomer } from '../customer';

import {
  assignCustomerUserContact,
  assignCustomerUserContactFail,
  assignCustomerUserContactSuccess,
  loadCustomerContact,
  loadCustomerContactFail,
  loadCustomerContactSuccess,
  loadCustomerContacts,
  loadCustomerContactsFail,
  loadCustomerContactsSuccess,
  loadCustomerUserContact,
  loadCustomerUserContactFail,
  loadCustomerUserContactSuccess,
  unassignCustomerUserContact,
  unassignCustomerUserContactFail,
  unassignCustomerUserContactSuccess,
} from './contact.actions';

@Injectable()
export class ContactEffects {
  constructor(
    private actions$: Actions,
    private organizationService: CamOrganizationService,
    @Inject(PLATFORM_ID) private platformId: string
  ) {}

  // Customer -> Contacts

  loadContactsForSelectedCustomerId$ = createEffect(() =>
    iif(
      () => isPlatformBrowser(this.platformId),
      this.actions$.pipe(
        ofType(selectCustomer),
        mapToPayloadProperty('customerId'),
        whenTruthy(),
        map(customerId => loadCustomerContacts({ customerId }))
      )
    )
  );

  // Customer -> Contacts

  loadCustomerContacts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadCustomerContacts),
      mapToPayloadProperty('customerId'),
      whenTruthy(),
      concatMap(customerId =>
        this.organizationService.getCustomerContacts(customerId).pipe(
          map(contacts => loadCustomerContactsSuccess({ customerId, contacts })),
          mapErrorToAction(loadCustomerContactsFail, { customerId })
        )
      )
    )
  );

  // Customer -> Contact

  loadCustomerContact$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadCustomerContact),
      mapToPayload(),
      switchMap(({ customerId, erpId }) =>
        this.organizationService.getCustomerContact(customerId, erpId).pipe(
          map(contact => loadCustomerContactSuccess({ customerId, contact })),
          mapErrorToAction(loadCustomerContactFail, { customerId, erpId })
        )
      )
    )
  );

  // Customer -> User -> Contact

  loadCustomerUserContact$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadCustomerUserContact),
      mapToPayload(),
      concatMap(({ customerId, userId }) =>
        this.organizationService.getCustomerUserContact(customerId, userId).pipe(
          map(contact => loadCustomerUserContactSuccess({ customerId, userId, contact })),
          mapErrorToAction(loadCustomerUserContactFail, { customerId, userId })
        )
      )
    )
  );

  // Customer -> User -> Contact -> Assign

  assignCustomerUserContact$ = createEffect(() =>
    this.actions$.pipe(
      ofType(assignCustomerUserContact),
      mapToPayload(),
      switchMap(({ customerId, userId, contact }) =>
        this.organizationService.updateCustomerUserContact(customerId, userId, contact).pipe(
          map(response =>
            assignCustomerUserContactSuccess({
              customerId,
              userId,
              contact: response,
              successMessage: 'camfil.account.organization.edit_user.assign_customer_user_contact.modal.text',
            })
          ),
          mapErrorToAction(assignCustomerUserContactFail, { customerId, userId, contact })
        )
      )
    )
  );

  // Customer -> User -> Contact -> Unassign

  unassignCustomerUserContact$ = createEffect(() =>
    this.actions$.pipe(
      ofType(unassignCustomerUserContact),
      mapToPayload(),
      switchMap(({ customerId, userId, contact }) =>
        this.organizationService.deleteCustomerUserContact(customerId, userId, contact).pipe(
          map(response =>
            unassignCustomerUserContactSuccess({
              customerId,
              userId,
              contact: response,
              successMessage: 'camfil.account.organization.edit_user.unassign_customer_user_contact.modal.text',
            })
          ),
          mapErrorToAction(unassignCustomerUserContactFail, { customerId, userId, contact })
        )
      )
    )
  );

  // Display Success Message for Updates

  displayUpdateCustomerUserContactSuccessMessage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(assignCustomerUserContactSuccess, unassignCustomerUserContactSuccess),
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

  displayUpdateCustomerUserFailMessage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(assignCustomerUserContactFail, unassignCustomerUserContactFail),
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
