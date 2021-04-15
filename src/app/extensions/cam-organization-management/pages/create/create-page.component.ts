import { AfterViewInit, ChangeDetectionStrategy, Component, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormArray } from '@angular/forms';
import { Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { CamfilOrganizationCustomerUserContactFormComponent } from '../../components/camfil-organization-user-customers-form/camfil-organization-customer-user-contact-form.component';
import { CamfilOrganizationUserDetailsFormComponent } from '../../components/camfil-organization-user-details-form/camfil-organization-user-details-form.component';
import { CamfilOrganizationUserRolesFormComponent } from '../../components/camfil-organization-user-roles-form/camfil-organization-user-roles-form.component';

import { CreatePageDataSourceComponent } from './create-page.data-source';

@Component({
  selector: 'camfil-user-detail-page',
  templateUrl: './create-page.component.html',
  styleUrls: ['./create-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
})
// tslint:disable-next-line:component-creation-test
export class CreatePageComponent extends CreatePageDataSourceComponent implements AfterViewInit {
  @ViewChild(CamfilOrganizationUserDetailsFormComponent) user: CamfilOrganizationUserDetailsFormComponent;
  @ViewChildren(CamfilOrganizationCustomerUserContactFormComponent)
  contacts!: QueryList<CamfilOrganizationCustomerUserContactFormComponent>;
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
      console.log('onCreateCustomerUser', 'SUCCESS');
    } else {
      console.log('onCreateCustomerUser', 'FAILURE');
    }

    // this.context$.pipe(take(1), whenTruthy()).subscribe(({ customer, user, contacts, roles }) => {
    //   // this.organizationFacade.createCustomerUser$(customer, user);
    //   // console.log('customer', customer);
    //   // console.log('user', user);
    //   // console.log('contacts', contacts);
    //   // console.log('roles', roles);
    // });
  }

  ngAfterViewInit() {
    super.ngAfterViewInit();

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
