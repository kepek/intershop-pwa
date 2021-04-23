import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatSelectChange } from '@angular/material/select';

import { CamfilB2bContact } from '../../models/camfil-b2b-contact/camfil-b2b-contact.model';
import { CamfilB2bCustomer } from '../../models/camfil-b2b-customer/camfil-b2b-customer.model';
import { CamfilB2bUser } from '../../models/camfil-b2b-user/camfil-b2b-user.model';

@Component({
  selector: 'camfil-organization-user-customer-contact-form',
  templateUrl: './camfil-organization-user-customer-contact-form.component.html',
  styleUrls: ['./camfil-organization-user-customer-contact-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
// tslint:disable-next-line:component-creation-test
export class CamfilOrganizationUserCustomerContactFormComponent implements OnInit, OnChanges {
  @Input() set customer(customer: CamfilB2bCustomer) {
    this.customerValue = customer;
  }

  get customer() {
    return this.customerValue;
  }

  private customerValue: CamfilB2bCustomer;

  @Input() set user(user: CamfilB2bUser) {
    this.userValue = user;
  }

  get user() {
    return this.userValue;
  }

  private userValue: CamfilB2bUser;

  @Output() connectUserWithCustomer = new EventEmitter<{
    customer: CamfilB2bCustomer;
    user: CamfilB2bUser;
  }>();

  @Output() disconnectUserFromCustomer = new EventEmitter<{
    customer: CamfilB2bCustomer;
    user: CamfilB2bUser;
  }>();

  @Output() connectContactWithUserAndCustomer = new EventEmitter<{
    customer: CamfilB2bCustomer;
    user: CamfilB2bUser;
    contact: CamfilB2bContact;
  }>();

  @Output() disconnectContactFromUserAndCustomer = new EventEmitter<{
    customer: CamfilB2bCustomer;
    user: CamfilB2bUser;
    contact: CamfilB2bContact;
  }>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {}

  get userCustomers() {
    return this?.user?.customers;
  }

  get userCustomer() {
    return this.userCustomers?.find(c => c.id === this.customer?.id);
  }

  get userCustomerContacts() {
    return this.userCustomer?.contacts;
  }

  get userCustomerSelectedContact() {
    return this.userCustomer?.userContact;
  }

  get hasUserCustomer() {
    return !!this.userCustomer;
  }

  get hasUserCustomerSelectedContact() {
    return !!this.userCustomerSelectedContact;
  }

  private initForm() {
    this.form = this.fb.group({
      customerContactCheckbox: new FormControl({
        value: false,
        disabled: false,
      }),
      customerContactSelect: new FormControl({
        value: undefined,
        disabled: false,
        validators: [Validators.required],
      }),
    });
  }

  private updateForm() {
    if (!(this.form instanceof FormGroup)) {
      return;
    }

    const checkboxControl = this.form.get('customerContactCheckbox');
    const selectControl = this.form.get('customerContactSelect');

    if (this.hasUserCustomer) {
      checkboxControl.setValue(true);
      selectControl.enable();
    } else {
      checkboxControl.setValue(false);
      selectControl.disable();
    }

    selectControl.setValue(this.userCustomerSelectedContact?.erpId);
  }

  onCheckboxChange(event: MatCheckboxChange) {
    const value = {
      customer: this.customer,
      user: this.user,
    };

    if (event.checked) {
      this.connectUserWithCustomer.emit(value);
    } else {
      this.disconnectUserFromCustomer.emit(value);
    }
  }

  onSelectChange(event: MatSelectChange) {
    const contact = this.userCustomerContacts?.find(c => c.erpId === event?.value);

    const value = {
      customer: this.customer,
      user: this.user,
      contact,
    };

    if (event.value) {
      this.connectContactWithUserAndCustomer.emit(value);
    } else {
      this.disconnectUserFromCustomer.emit(value);
    }
  }

  ngOnInit() {
    this.initForm();
    this.updateForm();
  }

  ngOnChanges() {
    this.updateForm();
  }
}
