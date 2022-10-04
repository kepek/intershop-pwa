import { AfterViewInit, ChangeDetectionStrategy, Component, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormArray } from '@angular/forms';
import { Subscription } from 'rxjs';
import { filter, take, takeUntil } from 'rxjs/operators';

import { whenTruthy } from 'ish-core/utils/operators';

import { CamfilOrganizationUserCustomerContactFormComponent } from '../../components/camfil-organization-user-customer-contact-form/camfil-organization-user-customer-contact-form.component';
import { CamfilOrganizationUserDetailsFormComponent } from '../../components/camfil-organization-user-details-form/camfil-organization-user-details-form.component';
import { CamfilOrganizationUserRolesFormComponent } from '../../components/camfil-organization-user-roles-form/camfil-organization-user-roles-form.component';

import { CreatePageDataSourceComponent } from './create-page.data-source';

@Component({
  selector: 'camfil-user-detail-page',
  templateUrl: './create-page.component.html',
  styleUrls: ['./create-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
// tslint:disable-next-line:component-creation-test
export class CreatePageComponent extends CreatePageDataSourceComponent implements AfterViewInit {
  @ViewChild(CamfilOrganizationUserDetailsFormComponent) user: CamfilOrganizationUserDetailsFormComponent;
  @ViewChildren(CamfilOrganizationUserCustomerContactFormComponent)
  contacts!: QueryList<CamfilOrganizationUserCustomerContactFormComponent>;
  @ViewChild(CamfilOrganizationUserRolesFormComponent) roles: CamfilOrganizationUserRolesFormComponent;

  form = new FormArray([]);

  contactsSubscription: Subscription;

  private populateForm() {
    this.form.clear();

    [this.user, this.roles, ...this.contacts].forEach(control => this.form.push(control.form));
  }

  onCreateCustomerUser() {
    this.form.markAllAsTouched();

    if (this.form.valid) {
      this.context$
        .pipe(
          take(1),
          whenTruthy(),
          filter(({ validCustomerContactRoles }) => validCustomerContactRoles)
        )
        .subscribe(({ customer, user, contacts, roles, approverIds }) => {
          if (customer && contacts.length && roles.length) {
            this.organizationFacade.createCustomerUser$(customer, user, contacts, roles, approverIds);
          } else {
            this.validCustomerContactRoles$.next(false);
          }
        });
    }
  }

  ngAfterViewInit() {
    if (this.contactsSubscription) {
      // tslint:disable-next-line: ban
      this.contactsSubscription.unsubscribe();
    }

    this.contactsSubscription = this.contacts.changes.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.populateForm();
    });

    this.populateForm();
  }
}
