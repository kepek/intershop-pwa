import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { CamfilApplicantReminder } from 'camfil-pwa/models/camfil-applicant-reminder/camfil-applicant-reminder.model';
import { CamfilApplicant } from 'camfil-pwa/models/camfil-applicant/camfil-applicant.model';
import { CamfilLangSubject } from 'camfil-pwa/models/camfil-lang/camfil-lang.model';
import {
  cloneCamfilOrder,
  getCamfilOrdersLoading,
  getOrders,
  getSelectedOrder,
  getSelectedOrderLineItems,
  loadCamfilOrderAdditionalTotalCost,
  loadCamfilOrderLineItems,
  loadCamfilOrderTrackAndTrace,
  loadCamfilOrders,
} from 'camfil-pwa/store/camfil-orders';
import { getCamfilPwaState } from 'camfil-pwa/store/camfil-pwa-store';
import {
  applyForAnAccount,
  getCamfilUserApplicant,
  getCamfilUserError,
  getCamfilUserLoading,
  getCamfilUserPreferredTitles,
  getCamfilUserReminderError,
  getCamfilUserReminderSuccess,
  loadCustomerUserPreferredLanguage,
  loadPreferredTitles,
  requestApplicantReminder,
  resetUsernameReminder,
  updateCustomerUserPreferredLanguage,
} from 'camfil-pwa/store/camfil-user';
import { deleteBasket } from 'camfil-pwa/store/ish-customer/ish-basket/ish-basket.actions';
import { first } from 'rxjs/operators';

// tslint:disable:member-ordering
@Injectable({ providedIn: 'root' })
export class CamfilPwaFacade {
  constructor(private store: Store) {
    store.pipe(first()).subscribe(() => {
      this.store.dispatch(loadPreferredTitles());
    });
  }

  camfilPwaState$ = this.store.pipe(select(getCamfilPwaState));

  applicant$ = this.store.pipe(select(getCamfilUserApplicant));
  preferredTitles$ = this.store.pipe(select(getCamfilUserPreferredTitles));

  applyForAnAccount(applicant: CamfilApplicant) {
    this.store.dispatch(applyForAnAccount({ applicant }));
  }

  loading$ = this.store.pipe(select(getCamfilUserLoading));
  error$ = this.store.pipe(select(getCamfilUserError));

  // USERNAME

  reminderSuccess$ = this.store.pipe(select(getCamfilUserReminderSuccess));
  reminderError$ = this.store.pipe(select(getCamfilUserReminderError));

  resetUsernameReminder() {
    this.store.dispatch(resetUsernameReminder());
  }

  requestApplicantReminder(data: CamfilApplicantReminder) {
    this.store.dispatch(requestApplicantReminder({ data }));
  }

  // ORDERS

  orders$() {
    this.store.dispatch(loadCamfilOrders());
    return this.store.pipe(select(getOrders));
  }

  orderLineItems$(orderId: string) {
    this.store.dispatch(loadCamfilOrderLineItems({ orderId }));
    return this.store.pipe(select(getSelectedOrderLineItems));
  }

  selectedOrder$ = this.store.pipe(select(getSelectedOrder));
  ordersLoading$ = this.store.pipe(select(getCamfilOrdersLoading));

  orderTrackAndTrace$(orderId: string) {
    this.store.dispatch(loadCamfilOrderTrackAndTrace({ orderId }));
  }

  orderAdditionalTotalCost$(orderId: string) {
    this.store.dispatch(loadCamfilOrderAdditionalTotalCost({ orderId }));
  }

  cloneCamfilOrder(orderId: string) {
    this.store.dispatch(cloneCamfilOrder({ orderId }));
  }

  // Preferred Language

  getCustomerUserPreferredLanguage$(subject: Omit<CamfilLangSubject, 'lang'>) {
    this.store.dispatch(loadCustomerUserPreferredLanguage(subject));
  }

  updateCustomerUserPreferredLanguage$(subject: CamfilLangSubject) {
    this.store.dispatch(updateCustomerUserPreferredLanguage(subject));
  }

  // basket

  deleteBasket$(basketId: string) {
    this.store.dispatch(deleteBasket({ basketId }));
  }
}
