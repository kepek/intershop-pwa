import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';

import { Applicant } from '../models/applicant/applicant.model';
import { LangSubject } from '../models/lang/lang.model';
import { UsernameReminder } from '../models/username-reminder/username-reminder.model';
import { applyForAnAccount, getApplicant, getApplicantError, getApplicantLoading } from '../store/applicant';
import { getCamAccountState } from '../store/cam-account-store';
import {
  createOrderDuplicate,
  getOrderLineItems,
  getOrders,
  getOrdersLoading,
  getSelectedOrder,
  loadOrderAdditionalTotalCost,
  loadOrderLineItems,
  loadOrderTrackAndTrace,
  loadOrders,
} from '../store/order';
import {
  getError,
  getLoading,
  getUsernameReminderError,
  getUsernameReminderSuccess,
  loadCustomerUserPreferredLanguage,
  requestUsernameReminder,
  resetUsernameReminder,
  updateCustomerUserPreferredLanguage,
} from '../store/user';

// tslint:disable:member-ordering
@Injectable({ providedIn: 'root' })
export class CamAccountFacade {
  constructor(private store: Store) {}

  camAccountState$ = this.store.pipe(select(getCamAccountState));

  applicant$ = this.store.pipe(select(getApplicant));
  applicantError$ = this.store.pipe(select(getApplicantError));
  applicantLoading$ = this.store.pipe(select(getApplicantLoading));

  applyForAnAccount(applicant: Applicant) {
    this.store.dispatch(applyForAnAccount({ applicant }));
  }

  loading$ = this.store.pipe(select(getLoading));
  error$ = this.store.pipe(select(getError));

  // USERNAME

  usernameReminderSuccess$ = this.store.pipe(select(getUsernameReminderSuccess));
  usernameReminderError$ = this.store.pipe(select(getUsernameReminderError));

  resetUsernameReminder() {
    this.store.dispatch(resetUsernameReminder());
  }

  requestUsernameReminder(data: UsernameReminder) {
    this.store.dispatch(requestUsernameReminder({ data }));
  }

  // ORDERS

  orders$() {
    this.store.dispatch(loadOrders());
    return this.store.pipe(select(getOrders));
  }

  orderLineItems$(orderId: string) {
    this.store.dispatch(loadOrderLineItems({ orderId }));
    return this.store.pipe(select(getOrderLineItems));
  }

  selectedOrder$ = this.store.pipe(select(getSelectedOrder));
  ordersLoading$ = this.store.pipe(select(getOrdersLoading));

  orderTrackAndTrace$(orderId: string) {
    this.store.dispatch(loadOrderTrackAndTrace({ orderId }));
  }

  orderAdditionalTotalCost$(orderId: string) {
    this.store.dispatch(loadOrderAdditionalTotalCost({ orderId }));
  }

  createOrderDuplicate(orderId: string) {
    this.store.dispatch(createOrderDuplicate({ orderId }));
  }

  // Preferred Language

  getCustomerUserPreferredLanguage$(subject: Omit<LangSubject, 'lang'>) {
    this.store.dispatch(loadCustomerUserPreferredLanguage(subject));
  }

  updateCustomerUserPreferredLanguage$(subject: LangSubject) {
    this.store.dispatch(updateCustomerUserPreferredLanguage(subject));
  }
}
