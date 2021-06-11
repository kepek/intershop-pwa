import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
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
import {
  connectContactWithUserAndCustomer,
  connectContactWithUserAndCustomerFail,
  connectContactWithUserAndCustomerSuccess,
} from '../user';

import {
  loadCustomerContact,
  loadCustomerContactFail,
  loadCustomerContactSuccess,
  loadCustomerContacts,
  loadCustomerContactsFail,
  loadCustomerContactsSuccess,
  loadCustomerUserContact,
  loadCustomerUserContactFail,
  loadCustomerUserContactSuccess,
} from './contact.actions';

@Injectable()
export class ContactEffects {
  constructor(private actions$: Actions, private organizationService: CamOrganizationService) {}

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

  // Customer -> User -> Contact -> Connect

  connectContactWithUserAndCustomer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(connectContactWithUserAndCustomer),
      mapToPayload(),
      switchMap(({ customerId, userId, contact }) =>
        this.organizationService.connectUserFromCustomerAndContactPlusReload(customerId, userId, contact).pipe(
          map(user =>
            connectContactWithUserAndCustomerSuccess({
              customerId,
              userId,
              user,
              successMessage: 'camfil.account.organization.edit_user.connect_contact_with_user_and_customer.modal.text',
            })
          ),
          mapErrorToAction(connectContactWithUserAndCustomerFail, { customerId, userId, contact })
        )
      )
    )
  );

  // Display Success Message for Updates

  displayUpdateCustomerUserContactSuccessMessage$ = createEffect(() =>
    this.actions$.pipe(
      ofType(connectContactWithUserAndCustomerSuccess),
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
      ofType(connectContactWithUserAndCustomerFail),
      mapToPayloadProperty('error'),
      whenTruthy(),
      map(error =>
        displayErrorMessage({
          message: error?.message || error?.code,
        })
      )
    )
  );
}
